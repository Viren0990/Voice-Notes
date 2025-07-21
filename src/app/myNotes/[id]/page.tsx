"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Play, Trash2, Edit, Tag, Calendar, Clock } from "lucide-react"
import { getNote } from "@/actions/getNotes"
import { Navbar } from "@/components/Navbar"
import { deleteNote } from "@/actions/deleteNote"
import { toast } from "sonner"

type Note = {
  id: string
  title: string
  content: string
  audioUrl: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  userId: string
}

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params) // ✅ unwrap the async params
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  

   const handlePlayAudio = (e: React.MouseEvent, audioUrl: string) => {
      e.stopPropagation() // Prevent navigation when clicking the play button
      new Audio(audioUrl).play()
    }

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true)
      const data = await getNote(id) // ✅ use unwrapped `id`
      if (data) setNote(data)
      setLoading(false)
    }

    fetchNote()
  }, [id])


  if (loading) {
    return (<>
        <div className="mb-8">
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center p-12 text-purple-600">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading note...</p>
      </div>
      </>
    )
  }

  if (!note) {
    return (
      <div className="p-6">
        <div className="mb-8">
        <Navbar />
      </div>
        <Button variant="ghost" className="mb-6 text-purple-600" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to notes
        </Button>
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Note not found</h2>
          <p className="text-purple-600">The note you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Navbar />
      </div>

      <div className="bg-white border border-purple-100 rounded-xl p-6 md:p-8 shadow-md mb-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-900">{note.title}</h1>
          <div className="flex gap-2">
            {note.audioUrl && (
              <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={(e) => handlePlayAudio(e, note.audioUrl)}>
                <Play className="h-4 w-4 mr-2" /> Play Audio
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50"
            onClick={async () => {
              try {
                await deleteNote((await params).id as string)
                toast.success("Note deleted successfully")
                router.push(`/myNotes`)
              }catch (err) {
                toast.error("Failed to delete note")
              }
            }}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 text-sm text-purple-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Created: {formatDate(note.createdAt, true)}
          </div>
          {note.updatedAt && note.updatedAt.toString() !== note.createdAt.toString() && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated: {formatDate(note.updatedAt, true)}
            </div>
          )}
        </div>

        <div className="prose prose-purple max-w-none mb-8">
          <div className="whitespace-pre-line bg-purple-50 p-6 rounded-lg text-purple-900">{note.content}</div>
        </div>

        {note.tags.length > 0 && (
          <div className="border-t border-purple-100 pt-6">
            <h3 className="text-sm font-medium text-purple-700 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center"
                >
                  <Tag className="h-3 w-3 mr-2 text-purple-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
