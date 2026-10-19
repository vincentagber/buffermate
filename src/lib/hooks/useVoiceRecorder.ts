'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface VoiceRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // in seconds
  audioBlob: Blob | null;
  audioUrl: string | null;
  liveTranscript: string;
  volumeLevel: number; // 0 to 1 for visualizer
  frequencyData: number[]; // frequency bars
  error: string | null;
}

export function useVoiceRecorder() {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
    liveTranscript: '',
    volumeLevel: 0,
    frequencyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupAudio = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      speechRecognitionRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      cleanupAudio();
      setState((prev) => ({
        ...prev,
        error: null,
        audioBlob: null,
        audioUrl: null,
        duration: 0,
        liveTranscript: '',
      }));

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Initialize Web Audio API Analyser for real-time visualizer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioVisuals = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            // Compute volume
            let sum = 0;
            const bars: number[] = [];
            const step = Math.floor(dataArray.length / 12);
            for (let i = 0; i < 12; i++) {
              const val = dataArray[i * step] || 0;
              bars.push(Math.min(100, Math.round((val / 255) * 100)));
              sum += val;
            }
            const avg = sum / dataArray.length;
            const normalizedVol = Math.min(1, avg / 128);

            setState((prev) => ({
              ...prev,
              volumeLevel: normalizedVol,
              frequencyData: bars,
            }));

            animFrameRef.current = requestAnimationFrame(updateAudioVisuals);
          };
          updateAudioVisuals();
        }
      } catch (audioCtxErr) {
        console.warn('AudioContext visualizer notice:', audioCtxErr);
      }

      // Initialize Web Speech API for real-time preview (if available)
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
              transcript += event.results[i][0].transcript + ' ';
            }
            setState((prev) => ({ ...prev, liveTranscript: transcript.trim() }));
          };

          recognition.onerror = (e: any) => {
            console.warn('Speech recognition notice:', e?.error);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (recErr) {
          console.warn('SpeechRecognition init notice:', recErr);
        }
      }

      // Initialize MediaRecorder
      audioChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        const url = URL.createObjectURL(audioBlob);
        setState((prev) => ({
          ...prev,
          isRecording: false,
          audioBlob,
          audioUrl: url,
          volumeLevel: 0,
        }));
      };

      recorder.start(250); // collect chunks every 250ms
      mediaRecorderRef.current = recorder;

      // Start duration timer
      timerIntervalRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);

      setState((prev) => ({
        ...prev,
        isRecording: true,
        error: null,
      }));
    } catch (err: any) {
      console.error('Failed to start recording:', err);
      cleanupAudio();
      setState((prev) => ({
        ...prev,
        isRecording: false,
        error:
          err?.name === 'NotAllowedError'
            ? 'Microphone permission denied. Please allow microphone access in your browser.'
            : 'Could not access microphone. Please check your audio devices.',
      }));
    }
  }, [cleanupAudio]);

  const stopRecording = useCallback((): Promise<{ blob: Blob; url: string; transcript: string }> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        reject(new Error('No active recording.'));
        return;
      }

      const recorder = mediaRecorderRef.current;

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);

        setState((prev) => {
          const finalTranscript = prev.liveTranscript;
          resolve({
            blob: audioBlob,
            url,
            transcript: finalTranscript,
          });
          return {
            ...prev,
            isRecording: false,
            audioBlob,
            audioUrl: url,
            volumeLevel: 0,
          };
        });
      };

      try {
        recorder.stop();
      } catch (e) {
        reject(e);
      }

      cleanupAudio();
    });
  }, [cleanupAudio]);

  const resetRecording = useCallback(() => {
    cleanupAudio();
    setState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
      liveTranscript: '',
      volumeLevel: 0,
      frequencyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      error: null,
    });
  }, [cleanupAudio]);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
