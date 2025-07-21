// utils/audio-recorder.ts
export const startRecording = async (
    onDataAvailable: (chunk: Blob) => void
  ): Promise<{
    stream: MediaStream,
    recorder: MediaRecorder
  } | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          onDataAvailable(e.data);
        }
      };
      
      recorder.start(250); 
      return { stream, recorder };
      
    } catch (error) {
      console.error("Recording failed:", error);
      return null;
    }
  };
  
  export const stopRecording = (
    recorder: MediaRecorder,
    stream: MediaStream
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const chunks: Blob[] = [];
      const onStop = () => {
        recorder.removeEventListener("stop", onStop);
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        resolve(audioBlob);
      };
  
      recorder.addEventListener("stop", onStop, { once: true });
      recorder.stop();
    });
  };