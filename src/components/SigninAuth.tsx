"use client"

import { Mic, Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signIn } from 'next-auth/react'
import Link from "next/link";


export const SigninAuth = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation
        if (!email || !password) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        try {
            const result = await signIn('credentials', {
              email,
              password,
              redirect: false
            })
        
            if (result?.error) {
              setError("Invalid credentials. Please try again.") // Set the error message here
            } else {
              router.push("/dashboard")
            }
          } catch (error) {
            setError("An unexpected error occurred. Please try again.") // Handle unexpected errors
          } finally {
            setLoading(false)
          }
    };

    return (
        <div className="bg-gradient-to-b from-white to-purple-50 flex-col justify-center items-center">
            <div className="mb-2 text-center">
                <div className="inline-flex items-center justify-center gap-2 mb-2 bg-white p-3 rounded-full shadow-md border border-purple-100">
                    <Mic className="h-6 w-6 text-purple-500" />
                </div>
                <h1 className="text-3xl font-bold text-purple-800 mb-2">Welcome to VoiceNotes</h1>
                <p className="text-gray-600">Signin into your account</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full opacity-70"></div>
                <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="johndoe@gmail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-purple-200 focus:border-purple-400 pl-4 h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="border-purple-200 focus:border-purple-400 pl-4 pr-10 h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-500 hover:text-purple-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-medium transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                    <label className="text-slate-600 text-center">Dont have an account? <Link key="/signup" href="/signup" className="text-purple-500">SignUp</Link></label>
                </form>
            </div>
        </div>
    );
};