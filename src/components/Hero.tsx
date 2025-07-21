"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export const Hero = () => {
  const router = useRouter()
  return (
    <section className="bg-gradient-to-b from-white to-purple-50 py-20">
      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50/50 px-3 py-1 text-sm text-purple-700 shadow-sm backdrop-blur-sm mb-4">
            Introducing VoiceNotes
          </div>

          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-800 to-cyan-700 bg-clip-text text-transparent max-w-4xl">
            Transform Your Voice into Organized Notes
          </h1>

          <p className="text-gray-600 pt-5 max-w-2xl mx-auto">
            Capture your thoughts effortlessly with our AI-powered voice-to-text app. Organize, edit, and access your
            notes anywhere.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-5">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg shadow-purple-300/20 text-white"
              onClick = {()=>{
                router.push(`/createNotes`)
              }}
            >
              Create Notes
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-300"
              onClick = {()=>{
                router.push(`/myNotes`)
              }}
            >
              My Notes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-purple-700 text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Speak Naturally</h3>
            <p className="text-gray-600">Just talk and our AI will convert your speech to text with high accuracy.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-purple-700 text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Organize Effortlessly</h3>
            <p className="text-gray-600">Our AI automatically categorizes and tags your notes for easy retrieval.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-purple-700 text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Anywhere</h3>
            <p className="text-gray-600">Sync across all your devices and access your notes from anywhere.</p>
          </div>
        </div>

       
        <div className="flex flex-wrap justify-center gap-8 mt-16 py-8 border-t border-b border-purple-100">
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-purple-700">10,000+</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-purple-700">1M+</p>
            <p className="text-gray-600">Notes Created</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-purple-700">99%</p>
            <p className="text-gray-600">Accuracy Rate</p>
          </div>
        </div>
      </div>

     
      <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-r from-purple-200 to-cyan-200 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-cyan-200 to-purple-200 rounded-full opacity-20 blur-3xl -z-10"></div>
    </section>
  )
}
