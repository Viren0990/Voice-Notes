"use server"

import { prisma } from "@/db";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth"; 



export async function auth() {
  return await getServerSession(NEXT_AUTH_CONFIG);
}

export const getNotes = async () => {
    const session = await auth();
    if (!session?.user?.id) {
       return [];
    }  

    return await prisma.note.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
      });
}

export const getNote = async (id: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });
  return note;
  
  } catch (error) {
    console.error('[getNote] Failed to fetch note:', error);
    return null;
  }
};
