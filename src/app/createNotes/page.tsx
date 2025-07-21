import { CreateNote } from "@/components/CreateNotes"
import { Navbar } from "@/components/Navbar"

export default function VoiceNoteRecorder() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-purple-800">
            Voice Note Recorder
          </h1>
          <p className="text-center text-purple-600/80 mb-10 max-w-2xl mx-auto">
            Capture your thoughts effortlessly with our intuitive voice recorder. Speak your mind, and we'll transform your voice into organized notes.
          </p>
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8">
            <CreateNote />
          </div>
        </div>
      </main>
      <footer className="mt-auto py-6 text-center text-purple-500/70 text-sm">
        <p>© {new Date().getFullYear()} VoiceNotes App. All rights reserved.</p>
      </footer>
    </div>
  )
}
