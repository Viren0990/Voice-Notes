"use client"

import { Mic, Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signup } from "@/actions/user";
import Link from "next/link";
 // Make sure this import path is correct

export const SignupAuth = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation
        if (!email || !username || !password || !confirmPassword) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }
        
        

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await signup(email, username, password);
            if (!res.success) {
                setError(typeof res.message === "string" ? res.message : "Signup failed");
            } else {
                router.push("/signin"); // Redirect to signin on success
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(password === e.target.value);
    };

    return (
        <div className="bg-gradient-to-b from-white to-purple-50 flex-col justify-center items-center">
            <div className="mb-2 text-center">
                <div className="inline-flex items-center justify-center gap-2 mb-2 bg-white p-3 rounded-full shadow-md border border-purple-100">
                    <Mic className="h-6 w-6 text-purple-500" />
                </div>
                <h1 className="text-3xl font-bold text-purple-800 mb-2">Join VoiceNotes</h1>
                <p className="text-gray-600">Create your account and start taking notes</p>
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
                        <Label htmlFor="username" className="text-gray-700 font-medium">
                            Username
                        </Label>
                        <Input
                            id="username"
                            placeholder="John Doe"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="border-purple-200 focus:border-purple-400 pl-4 pr-10 h-12 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-purple-200"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-500 hover:text-purple-500"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {!passwordMatch && (
                            <p className="text-red-500 text-sm">Passwords do not match</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-medium transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                    <label className="text-slate-600 text-center">Already have an account? <Link key="/signin" href="/signin" className="text-purple-500">SignIn</Link></label>
                </form>
            </div>
        </div>
    );
};