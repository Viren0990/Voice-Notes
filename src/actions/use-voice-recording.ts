"use client"
import { useState, useRef, useEffect } from 'react';
import { initializeRecognition } from '@/actions/speech-recognition';
import { startRecording as startAudioRecording, stopRecording as stopAudioRecording } from '@/actions/audio-recorder';
import { VoiceRecordingReturn } from '@/types/voice-recording';

export const useVoiceRecording = (isAudioOnly: boolean): VoiceRecordingReturn => {
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(true);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isAudioOnly) {
      recognitionRef.current = initializeRecognition(
        "en-US",
        (text) => setTranscript(prev => prev + text),
        (errorMsg) => {
          setError(errorMsg);
          if (errorMsg.includes('denied')) {
            setIsPermissionGranted(false);
          }
        }
      );
      setIsBrowserSupported(!!recognitionRef.current);
    }

    return () => {
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [isAudioOnly]);

  const startRecording = async (): Promise<boolean> => {
    try {
      setError("");
      
      audioChunksRef.current = []; 
      
      const recording = await startAudioRecording((chunk) => {
        audioChunksRef.current.push(chunk);
      });

      if (recording) {
        streamRef.current = recording.stream;
        recorderRef.current = recording.recorder;
        
        if (!isAudioOnly && recognitionRef.current) {
          recognitionRef.current.start();
        }
        
        setIsRecording(true);
        setHasRecording(false);
        setIsPermissionGranted(true);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to start recording");
      return false;
    }
  };


  const stopRecording = async (): Promise<Blob | null> => {
    try {
      if (recorderRef.current && streamRef.current) {
        recognitionRef.current?.stop();
        const audioBlob = await stopAudioRecording(recorderRef.current, streamRef.current);
        setHasRecording(true);
        return audioBlob;
      }
      return null;
    } catch (err) {
      setError("Failed to stop recording");
      return null;
    } finally {
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setTranscript("");
    audioChunksRef.current = [];
    setHasRecording(false);
    setError("");
  };

  const updateTranscript = (newTranscript: string) => {
    setTranscript(newTranscript);
  };


  return {
    transcript,
    error,
    isRecording,
    hasRecording,
    isPermissionGranted,
    isBrowserSupported,
    audioChunks: audioChunksRef.current,
    startRecording,
    stopRecording,
    resetRecording,
    updateTranscript
  };
};