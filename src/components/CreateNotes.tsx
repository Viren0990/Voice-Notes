"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useVoiceRecording } from "@/actions/use-voice-recording"
import { uploadAudio } from "@/actions/upload"
import { saveNoteToDB } from "@/actions/save-note"
import { Mic, MicOff, Save, Tag, AlertCircle, CheckCircle, Loader2, FileAudio, FileText, Sparkles } from "lucide-react"

export const CreateNote = () => {
  const { data: session, status } = useSession()
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [isAudioOnly, setIsAudioOnly] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  const {
    transcript,
    error: recognitionError,
    startRecording,
    stopRecording,
    isRecording,
    hasRecording,
    isPermissionGranted,
    isBrowserSupported,
    audioChunks,
    resetRecording,
    updateTranscript,
  } = useVoiceRecording(isAudioOnly)

  const handleStartRecording = async () => {
    setError(null)
    setSuccessMessage("")
    const started = await startRecording()
    if (!started) {
      setError("Failed to start recording")
    }
  }

  const handleStopRecording = async () => {
    setIsProcessing(true)
    try {
      await stopRecording()
    } catch (err) {
      setError("Failed to stop recording")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSave = async () => {
    if ((!transcript.trim() && !isAudioOnly) || !title.trim()) {
      setError("Please add a title and record some content before saving.")
      return
    }

    if (!session?.user?.id) {
      setError("You must be logged in to save notes.")
      return
    }

    try {
      setIsProcessing(true)
      setError(null)
      setSuccessMessage("")

      let audioUrl = ""
      if (audioChunks.length > 0) {
        try {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
          const formData = new FormData()
          formData.append("audio", audioBlob, `${title}-${Date.now()}.webm`)

          const uploadResult = await uploadAudio(formData)
          audioUrl = uploadResult?.url || ""
        } catch (uploadError) {
          console.error("Upload failed:", uploadError)
          setError("Note saved but audio upload failed")
        }
      }

      await saveNoteToDB({
        title,
        content: isAudioOnly ? "Audio recording" : transcript,
        audioUrl,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        userId: session.user.id,
      })

      // Reset all form and recording state
      setTitle("")
      setTags("")
      resetRecording()
      setSuccessMessage("Note saved successfully!")
    } catch (error) {
      console.error("Save failed:", error)
      setError(error instanceof Error ? error.message : "Failed to save note")
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleAudioOnlyMode = () => {
    if (!isRecording) {
      setIsAudioOnly(!isAudioOnly)
      setError(null)
      setSuccessMessage("")
    }
  }

  if (!isBrowserSupported) {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-xl shadow-sm border border-red-100 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
        <p>Your browser doesn't support speech recognition. Please try Chrome or Edge.</p>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="p-6 bg-blue-50 text-blue-800 rounded-xl shadow-sm border border-blue-100 flex items-center gap-3">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
        <p>Loading session...</p>
      </div>
    )
  }

  if (!session?.user?.id) {
    return (
      <div className="p-6 bg-yellow-50 text-yellow-800 rounded-xl shadow-sm border border-yellow-100 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
        <p>You must be logged in to use this feature.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto relative">
      
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 -right-10 w-40 h-40 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative z-10">
      
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Mic className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">Voice Note Recorder</h1>
            </div>
            <p className="text-purple-100 mt-1 ml-12 font-light">Capture your thoughts with the power of your voice</p>
          </div>

          
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 h-8 opacity-70">
              <div className="flex justify-around items-end h-full">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white w-1 rounded-t-full animate-waveform"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

       
        <div className="p-8 space-y-6">
          {!isPermissionGranted && (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100 flex items-center gap-3 shadow-inner">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <p>Microphone permission denied. Please allow microphone access to record.</p>
            </div>
          )}

          {recognitionError && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex items-center gap-3 shadow-inner">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p>{recognitionError}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex items-center gap-3 shadow-inner">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 rounded-xl border border-green-100 shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-green-500 rounded-full">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <p className="font-medium">{successMessage}</p>
              </div>
              {audioChunks.length > 0 && (
                <div className="mt-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-green-100 shadow-sm">
                  <audio
                    controls
                    src={URL.createObjectURL(new Blob(audioChunks, { type: "audio/webm" }))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isAudioOnly ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
              >
                {isAudioOnly ? <FileAudio className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Recording Mode</h3>
                <p className="text-sm text-gray-500">
                  {isAudioOnly ? "Audio only (no transcription)" : "With transcription"}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAudioOnly}
                onChange={toggleAudioOnlyMode}
                disabled={isRecording}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          
          <div className="grid gap-6 mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="p-1.5 bg-purple-100 rounded-md text-purple-600">
                  <Sparkles className="h-4 w-4" />
                </span>
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <input
                  className="block w-full rounded-xl border-0 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-white/70 backdrop-blur-sm transition-all duration-200 focus:bg-white"
                  placeholder="Enter note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isRecording}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                  <Tag className="h-4 w-4" />
                </span>
                Tags
              </label>
              <div className="relative rounded-xl shadow-sm">
                <input
                  className="block w-full rounded-xl border-0 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-white/70 backdrop-blur-sm transition-all duration-200 focus:bg-white"
                  placeholder="work, ideas, todo (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isRecording}
                />
              </div>
            </div>

            {!isAudioOnly && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
                    <FileText className="h-4 w-4" />
                  </span>
                  Transcript
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <textarea
                    className="block w-full rounded-xl border-0 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 bg-white/70 backdrop-blur-sm transition-all duration-200 focus:bg-white min-h-[150px]"
                    placeholder="Transcribed content will appear here..."
                    value={transcript}
                    onChange={(e) => updateTranscript(e.target.value)}
                    disabled={isRecording}
                  />
                  {isRecording && (
                    <div className="absolute bottom-3 right-3 text-xs text-white bg-purple-600 px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                      Transcribing...
                    </div>
                  )}
                </div>
              </div>
            )}

            
            <div className="flex flex-wrap gap-4 mt-4">
              {!isRecording ? (
                <>
                  <button
                    onClick={handleStartRecording}
                    disabled={isProcessing}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-medium transition-all ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-200/50 transform hover:-translate-y-0.5"
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                    Start Recording
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasRecording || isProcessing || !title.trim()}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-medium transition-all ${
                      !hasRecording || isProcessing || !title.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-200/50 transform hover:-translate-y-0.5"
                    }`}
                  >
                    <Save className="h-5 w-5" />
                    Save Note
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStopRecording}
                  disabled={isProcessing}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-medium transition-all ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg hover:shadow-red-200/50 transform hover:-translate-y-0.5"
                  }`}
                >
                  <MicOff className="h-5 w-5" />
                  Stop Recording
                </button>
              )}
            </div>

            <div className="mt-2">
              {isRecording && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border border-red-100 shadow-inner">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </div>
                  <span className="font-medium text-red-800">Recording in progress...</span>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-inner">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="font-medium text-blue-800">Processing your recording...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes waveform {
          0%, 100% {
            height: 10%;
          }
          50% {
            height: 100%;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-waveform {
          animation: waveform 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
