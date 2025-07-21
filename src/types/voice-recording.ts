// types/voice-recording.ts
export type VoiceRecordingReturn = {
    transcript: string;
    error: string;
    isRecording: boolean;
    hasRecording: boolean;
    isPermissionGranted: boolean;
    isBrowserSupported: boolean;
    audioChunks: Blob[];
    startRecording: () => Promise<boolean>;
    stopRecording: () => Promise<Blob | null>;
    resetRecording: () => void;
    updateTranscript: (newTranscript: string) => void; // Add this
  };