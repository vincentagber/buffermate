'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Type,
  X,
  Loader2,
  CheckCircle2,
  Calendar,
  Volume2,
  ArrowRight,
  AlertCircle,
  Play,
  RotateCcw,
  Square,
  Wand2,
} from 'lucide-react';
import { useVoiceRecorder } from '@/lib/hooks/useVoiceRecorder';
import { ExtractedFormData } from '@/lib/ai/form-schema';
import { triggerConfetti } from '@/components/ui/Confetti';
import { SocialPlatformIcon } from '@/components/SocialIcons';

interface AiVoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: ExtractedFormData) => void;
  title?: string;
  subtitle?: string;
}

const SAMPLE_BRIEFS = [
  {
    label: 'Launch Announcement',
    text: 'Schedule an exciting announcement post for tomorrow at 3pm on Twitter and LinkedIn. Mention we are launching our new AI features and offer 20% off with promo code LAUNCH20.',
  },
  {
    label: 'Weekend Growth Tips',
    text: 'Write a professional thought-leadership post for LinkedIn and Threads on Friday morning at 9am about 3 productivity tips that save 10 hours a week. Include actionable advice and hashtags.',
  },
  {
    label: 'Viral Video Script',
    text: 'Create a short video hook for TikTok and Instagram explaining why manual form filling is obsolete and how AI voice extraction works in 2026. Make it energetic and witty.',
  },
];

export default function AiVoiceFormModal({
  isOpen,
  onClose,
  onApplyData,
  title = 'Generate task with AI',
  subtitle = 'Just describe what you want to get done. AI will instantly draft a perfect title, write instructions, and fill the form for you!',
}: AiVoiceFormModalProps) {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');
  const [draftText, setDraftText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [extractedResult, setExtractedResult] = useState<ExtractedFormData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    isRecording,
    duration,
    audioBlob,
    audioUrl,
    liveTranscript,
    frequencyData,
    error: recorderError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  // Reset states when modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      resetRecording();
      setExtractedResult(null);
      setErrorMessage(null);
      setIsProcessing(false);
      setProcessingStage('');
    }
  }, [isOpen, resetRecording]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit audio or text for Whisper & LLM extraction
  const processExtraction = async (payload: { audio?: Blob; text?: string; clientTranscript?: string }) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setExtractedResult(null);

    try {
      let response: Response;

      if (payload.audio) {
        setProcessingStage('Transcribing with Whisper & analyzing with LLM...');
        const formData = new FormData();
        formData.append('audio', payload.audio, 'recording.webm');
        if (payload.clientTranscript) {
          formData.append('clientTranscript', payload.clientTranscript);
        }
        formData.append('now', new Date().toISOString());

        response = await fetch('/api/ai/extract-form', {
          method: 'POST',
          body: formData,
        });
      } else {
        setProcessingStage('Extracting structured parameters with LLM & Zod...');
        response = await fetch('/api/ai/extract-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: payload.text,
            now: new Date().toISOString(),
          }),
        });
      }

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || 'Failed to extract form fields.');
      }

      const json = await response.json();
      if (!json.success || !json.data) {
        throw new Error('Invalid response received from extraction service.');
      }

      setProcessingStage('Validating with Zod schema...');
      setExtractedResult(json.data);

      // Trigger confetti celebration
      try {
        triggerConfetti();
      } catch (e) {
        // ignore
      }

      // Auto-apply after a brief celebration preview
      setTimeout(() => {
        onApplyData(json.data);
        onClose();
      }, 1400);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMessage(err.message || 'Something went wrong while processing your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceStopAndProcess = async () => {
    try {
      const { blob, transcript } = await stopRecording();
      await processExtraction({
        audio: blob,
        clientTranscript: transcript,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete recording.');
    }
  };

  const handleTextSubmit = async () => {
    if (!draftText.trim()) {
      setErrorMessage('Please paste or write a brief or rough draft first.');
      return;
    }
    await processExtraction({ text: draftText });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isProcessing && !isRecording) onClose();
        }}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Voice / Text Pill) */}
        <div className="px-6 pt-4 pb-2">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center">
            <button
              type="button"
              onClick={() => {
                if (!isRecording && !isProcessing) setActiveTab('voice');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'voice'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>Voice</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isRecording && !isProcessing) setActiveTab('text');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'text'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-4 h-4 text-slate-600" />
              <span>Text</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6">
          {/* Error Message Alert */}
          {(errorMessage || recorderError) && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage || recorderError}</div>
            </div>
          )}

          {/* Success Extraction Preview Overlay */}
          {extractedResult && (
            <div className="py-6 flex flex-col items-center text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                Form Auto-Filled Successfully!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mb-5">
                AI extracted structured parameters with Zod schema validation and populated your form.
              </p>

              {/* Extracted Badges */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 mb-2">
                <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                  📌 {extractedResult.title}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {extractedResult.platforms.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md shadow-2xs"
                    >
                      <SocialPlatformIcon channel={p} className="w-3 h-3" />
                      <span className="capitalize">{p}</span>
                    </span>
                  ))}
                  <span className="text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {extractedResult.scheduledAtDisplay || extractedResult.scheduledAt}
                  </span>
                  <span className="text-[11px] font-medium bg-purple-50 border border-purple-200 text-purple-700 px-2 py-0.5 rounded-md capitalize">
                    Tone: {extractedResult.tone}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && !extractedResult && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-4 h-4 animate-bounce" />
                </div>
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                AI Extracting & Polishing...
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">{processingStage}</p>
            </div>
          )}

          {/* VOICE TAB CONTENT */}
          {activeTab === 'voice' && !isProcessing && !extractedResult && (
            <div className="flex flex-col items-center text-center py-2">
              {/* Mic Button & Waveform Container */}
              <div className="relative mb-5 flex flex-col items-center">
                {/* Pulsing ring animation when recording */}
                {isRecording && (
                  <>
                    <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse" />
                  </>
                )}

                {/* Big Circular Green Button (Matches Kobble Screenshot) */}
                <button
                  type="button"
                  onClick={() => {
                    if (isRecording) {
                      handleVoiceStopAndProcess();
                    } else {
                      startRecording();
                    }
                  }}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 shadow-xl ${
                    isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                      : 'bg-[#5b8743] hover:bg-[#4d7438] sm:bg-[#608b47] shadow-[#5b8743]/30 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: isRecording ? '#dc2626' : '#5f8e43',
                  }}
                  title={isRecording ? 'Click to finish' : 'Click to record'}
                >
                  {isRecording ? (
                    <Square className="w-8 h-8 fill-current text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white stroke-[2.2]" />
                  )}
                </button>
              </div>

              {/* Title & Status */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                {isRecording ? (
                  <span className="flex items-center justify-center gap-2 text-rose-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    Recording... ({formatTimer(duration)})
                  </span>
                ) : (
                  'Tap to start recording'
                )}
              </h4>

              {/* Description (Kobble copy) */}
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
                {isRecording
                  ? 'Speak naturally. Mention topics, target channels, schedule timing, or discount codes. Tap the red button when finished!'
                  : subtitle}
              </p>

              {/* Live Waveform Frequency Visualizer */}
              {isRecording && (
                <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4">
                  <div className="flex items-end justify-center gap-1.5 h-10 mb-2">
                    {frequencyData.map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-emerald-500 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(12, h)}%` }}
                      />
                    ))}
                  </div>
                  {liveTranscript ? (
                    <div className="text-xs text-slate-700 italic font-mono bg-white p-2.5 rounded-lg border border-slate-200 line-clamp-2 text-left">
                      "{liveTranscript}"
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">
                      Listening to your microphone...
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons when Recording */}
              {isRecording && (
                <div className="flex items-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={resetRecording}
                    className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleVoiceStopAndProcess}
                    className="flex-2 py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Done, Fill Form
                  </button>
                </div>
              )}

              {/* Speech Prompt Inspiration Chips */}
              {!isRecording && (
                <div className="w-full pt-2 border-t border-slate-100 text-left">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Try speaking ideas like:
                  </span>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        processExtraction({
                          text: SAMPLE_BRIEFS[0].text,
                        })
                      }
                      className="w-full text-left text-xs text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 p-2 rounded-lg border border-slate-100 transition-colors flex items-center justify-between group"
                    >
                      <span className="line-clamp-1">
                        "Schedule Twitter & LinkedIn post for tomorrow at 3pm announcing launch..."
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TEXT TAB CONTENT */}
          {activeTab === 'text' && !isProcessing && !extractedResult && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Paste your brief or requirements
                </label>
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Paste rough requirements or a brief here... AI will auto-refine it and fill the form for you."
                  rows={5}
                  className="w-full p-3.5 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Sample Draft Quick-Fills */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Or load a sample draft:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_BRIEFS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => setDraftText(sample.text)}
                      className="text-[11px] font-medium px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-transparent rounded-lg text-slate-600 transition-all"
                    >
                      💡 {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTextSubmit}
                  disabled={!draftText.trim()}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99]"
                  style={{ backgroundColor: '#5f8e43' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
