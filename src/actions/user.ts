"use server"

import bcrypt from "bcrypt";
import { prisma } from "@/db";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  username: z.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^\w+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signup(email: string, username: string, password: string) {
  try {
    
    const validatedData = signupSchema.parse({ email, username, password });
    
    
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    if (isNaN(saltRounds)) {
      throw new Error("Invalid salt rounds configuration");
    }

    
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
      },
    });
  
    return { success: true, user };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      
      return { success: false, message: error.errors[0].message };
    }
    
    if (error.code === "P2002") {
      return { success: false, message: "Email is already taken" };
    }
    
    console.error("Signup Error:", error);
    return { success: false, message: "An error occurred. Please try again later." };
  }
}