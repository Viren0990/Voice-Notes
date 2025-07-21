"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { getNotes } from "@/actions/getNotes"
import { formatDate, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Play, Trash2, ChevronRight, Music, Tag, Clock, Pin, Star } from 'lucide-react'
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

// Define the Note type according to your schema
type Note = {
  id: string
  title: string
  content: string
  audioUrl: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
  isPinned?: boolean
  isStarred?: boolean
}

export const NotesList = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        const data = await getNotes()
        
        
        const sortedNotes = [...data].sort((a, b) => {

          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        
        setNotes(sortedNotes)
      } catch (error) {
        console.error("Failed to fetch notes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const handleNoteClick = (id: string) => {
    router.push(`/myNotes/${id}`)
  }

  const handlePlayAudio = (e: React.MouseEvent, audioUrl: string) => {
    e.stopPropagation() // Prevent navigation when clicking the play button
    new Audio(audioUrl).play()
  }

  const handleMouseEnter = (id: string) => {
    setActiveNote(id)
  }

  const handleMouseLeave = () => {
    setActiveNote(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-purple-600">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="h-8 w-8 text-purple-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-lg font-medium bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
          Loading your notes...
        </p>
      </div>
    )
  }

  if (notes.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute inset-2 bg-purple-100 rounded-full flex items-center justify-center">
            <Music className="h-10 w-10 text-purple-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
            +
          </div>
        </div>
        <h3 className="text-2xl font-bold text-purple-800 mb-3">No notes yet</h3>
        <p className="text-purple-600 mb-8 max-w-md">
          Your voice notes will appear here. Start recording your thoughts to create your first note!
        </p>
        <Button
          className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-6 h-auto text-lg rounded-xl shadow-lg hover:shadow-purple-200/50 transition-all duration-300"
          onClick={() => router.push("/create")}
        >
          Create Your First Note
        </Button>
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => handleNoteClick(note.id)}
          onMouseEnter={() => handleMouseEnter(note.id)}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
            "border border-purple-100 hover:border-purple-300",
            "relative group",
            activeNote === note.id 
              ? "shadow-lg shadow-purple-100 transform -translate-y-1" 
              : "shadow-md hover:shadow-lg"
          )}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Status indicators */}
          <div className="absolute top-0 left-0 p-1.5 flex gap-1.5">
            {note.isPinned && (
              <div className="bg-purple-100 p-1 rounded-md text-purple-600" title="Pinned">
                <Pin className="h-3.5 w-3.5" />
              </div>
            )}
            {note.isStarred && (
              <div className="bg-amber-100 p-1 rounded-md text-amber-500" title="Starred">
                <Star className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-purple-900 group-hover:text-purple-700 transition-colors pr-12">
                {note.title}
              </h3>
              <div className="flex gap-1.5 z-10">
                {note.audioUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                    onClick={(e) => handlePlayAudio(e, note.audioUrl)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
              </div>
            </div>

            <div className="mb-4">
              <p className="text-purple-800 line-clamp-2 whitespace-pre-line">{note.content}</p>
              {note.content.split("\n").length > 2 || note.content.length > 150 ? (
                <div className="text-right mt-1">
                  <span className="text-xs text-purple-500 inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ChevronRight className="h-3 w-3 ml-1" />
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-50">
              <div className="flex items-center text-xs text-purple-400">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(note.createdAt, true)}
              </div>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end">
                  {note.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full flex items-center"
                    >
                      <Tag className="h-2.5 w-2.5 mr-1 text-purple-400" />
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </motion.div>
      ))}
    </div>
  )
}

