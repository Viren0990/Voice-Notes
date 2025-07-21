"use client"

import { useState } from "react"
import { NotesList } from "@/components/getNotes"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, SortAsc, Grid2X2, List, Mic, Sparkles, ChevronDown } from 'lucide-react'
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Notes() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Your Notes</h1>
              <p className="text-purple-600 mt-1">Capture and organize your thoughts</p>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white self-start md:self-center"
              onClick={()=>{
                router.push(`/createNotes`)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          <div className="w-full h-1 bg-purple-400 mb-4"></div>

          
        </motion.div>
        
      
        
        {/* Decorative Elements */}
        <div className="absolute top-32 right-10 w-64 h-64 bg-purple-200 rounded-full opacity-10 blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-300 rounded-full opacity-10 blur-3xl -z-10"></div>
        
        {/* Notes List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <NotesList />
        </motion.div>
      </main>
    </div>
  )
}

