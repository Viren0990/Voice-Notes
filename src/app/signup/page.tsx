import { SignupAuth } from "@/components/SignupAuth"
import { BookText, BrainCircuit, CircleUser, Mic, Sparkles } from "lucide-react"

export default function Signup() {
  return (
    <div className="flex min-h-screen">
      {/* Decorative left panel - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-bl from-purple-800 via-purple-600 to-purple-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute bottom-40 right-10 w-60 h-60 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/30 blur-lg"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">Voice Notes</span>
          </h2>

          <p className="text-xl text-white/90 mb-8 font-light">Write it. Speak it. Remember it.</p>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-full">
                <Mic className="w-5 h-5" />
              </div>
              <span>Record voice notes on the go</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-full">
                <BookText className="w-5 h-5" />
              </div>
              <span>Organize your thoughts effortlessly</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-full">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span>AI-powered transcription and insights</span>
            </div>
          </div>
        </div>
      </div>
      {/* Auth content - full width on mobile, half width on desktop */}
      <div className="flex w-full md:w-1/2 p-6">
        <div className="max-w-md w-full mx-auto my-auto">
          <SignupAuth />
        </div>
      </div>
    </div>
  )
}
