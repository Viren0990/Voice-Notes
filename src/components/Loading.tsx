"use client"

export default function LoadingComp() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="relative">
       
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-purple-300 animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-purple-600 animate-pulse"></div>
            </div>
          </div>
        </div>

        
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="absolute w-3 h-3 bg-purple-500 rounded-full animate-orbit"></div>
        </div>

        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>

     
      <style jsx global>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(18px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(18px) rotate(-360deg);
          }
        }
        .animate-orbit {
          animation: orbit 1.5s linear infinite;
        }
      `}</style>
    </div>
  )
}
