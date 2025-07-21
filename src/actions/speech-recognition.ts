// utils/speech-recognition.ts

type SpeechRecognition = {
    continuous: boolean           
    interimResults: boolean      
    lang: string                  
    start: () => void             
    stop: () => void             
    onresult: (event: SpeechRecognitionEvent) => void 
    onerror: (event: SpeechRecognitionErrorEvent) => void 
  }

  declare global {
    interface Window {
      SpeechRecognition: new () => SpeechRecognition
      webkitSpeechRecognition: new () => SpeechRecognition
    }
  }

  
  
type SpeechRecognitionEvent = {
    results: SpeechRecognitionResultList
  }
  
  type SpeechRecognitionErrorEvent = {
    error: 'no-speech' | 'aborted' | 'audio-capture' | 'network' | 'not-allowed' | 'service-not-allowed' | 'bad-grammar' | 'language-not-supported'
    message: string
  }
  
  export const initializeRecognition = (
    lang: string,
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
  
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;
  
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        onResult(last[0].transcript + " ");
      }
    };
  
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMsg = event.error === 'not-allowed' 
        ? 'Microphone access denied. Please allow permission.'
        : `Speech recognition error: ${event.error}`;
      onError(errorMsg);
    };
  
    return recognition;
  };