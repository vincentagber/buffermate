# BufferMate Gemini Integration Documentation

## Overview

BufferMate integrates Google's Gemini models (`gemini-1.5-flash` for multimodal text/voice reasoning and `imagen-3.0-generate-002` for image synthesis). This document outlines the architecture, end-to-end request flow, error handling, and test coverage across the three core AI capabilities.

---

## 1. Core Capabilities

### 1.1 Content Posting (Text & Multi-Platform Copy)
- **User Action**: The user enters a topic/brief in the Scheduler Modal (`PostSchedulerModal.tsx`) and clicks **"Generate with AI"** (`handleAiSuggest`), or enters a brief via the Voice modal.
- **Request Flow**:
  1. Frontend dispatches a `POST` request to `/api/ai/social-post`.
  2. Next.js proxies the call to the PHP backend `AiStudioController::generatePost`.
  3. `GeminiDriver::generateSocialPost` constructs a structured prompt specifying strict JSON output with fields for caption, hook, body, call-to-action, hashtags, suggested media, and platform-specific variants (Facebook, Instagram, LinkedIn, X, TikTok, Threads).
  4. The model returns structured JSON. Platform character counts and variants are calculated.
  5. The result is returned to the UI and displayed in the real-time preview tab.
  6. The user reviews and clicks **"Publish Now"** or **"Schedule Post"**, which dispatches to `/api/social/publish` or `/api/posts`.

### 1.2 Voice Feature (Speech Capture & Form Extraction)
- **User Action**: The user clicks the microphone button in `AiVoiceFormModal.tsx` or the composer to record a voice brief.
- **Speech Capture**:
  1. `useVoiceRecorder.ts` accesses the microphone via `navigator.mediaDevices.getUserMedia`.
  2. Captures audio into a `Blob` (`audio/webm`, `audio/wav`, etc.) while driving a real-time Web Audio API visualizer.
  3. On recording completion, the client submits a `multipart/form-data` request containing the audio file to `/api/ai/extract-form`.
- **Audio Processing**:
  1. `AiStudioController::extractForm` delegates to `GeminiDriver::extractFromAudioOrText`.
  2. The backend validates the MIME type (`audio/webm`, `audio/wav`, `audio/mp3`, `audio/ogg`, `audio/m4a`, `audio/mp4`). Unsupported formats are rejected with an explicit `422` error (`UNSUPPORTED_AUDIO_FORMAT`).
  3. Valid audio is base64-encoded and dispatched directly to Gemini as multimodal `inlineData` with a structured schema prompt.
  4. Gemini transcribes the audio and extracts: `title`, `content`, `platforms`, `scheduledAt`, `scheduledAtDisplay`, `tone`, `mode`, `hashtags`, and `callToAction`.
  5. The extracted post is returned to the UI, populated into the scheduler fields, and ready for one-click scheduling.

### 1.3 Text and Image Generation (Modality Separation)
- **Separation of Modalities**:
  - Text generation (`/api/ai/social-post`) produces post copy, hooks, and an `imagePrompt` describing a matching visual.
  - Image generation (`/api/ai/image`) is handled through an independent endpoint and controller action.
- **Image Generation Flow**:
  1. User triggers image generation via **"AI Visual (Gemini)"** in the media attachment section.
  2. Frontend dispatches `POST /api/ai/image` with `{ prompt, style, aspectRatio }`.
  3. Backend calls `GeminiDriver::generateImage`, which routes to Google Imagen (`imagen-3.0-generate-002:predict`).
  4. If generation succeeds, base64 JPEG data or hosted URL is returned and displayed in the live preview card.
  5. Either modality can be regenerated, edited, or removed independently without affecting the other.

---

## 2. Configuration & Environment Variables

### Backend Configuration (`buffermate-backend/.env`)
```ini
# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_google_ai_studio_key_here
NEWSPILOT_GEMINI_API_KEY=your_actual_google_ai_studio_key_here
GEMINI_TEXT_MODEL=gemini-1.5-flash
NEWSPILOT_GEMINI_MODEL=gemini-1.5-flash
GEMINI_IMAGE_MODEL=imagen-3.0-generate-002
```

### Frontend Configuration (`buffermate-frontend/.env.local`)
```ini
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
LARAVEL_API_URL=http://127.0.0.1:8001
GEMINI_TEXT_MODEL=gemini-1.5-flash
GEMINI_IMAGE_MODEL=imagen-3.0-generate-002
```

---

## 3. Error Handling Matrix

| Error Scenario | HTTP Status | Error Code | Behavior & User Messaging |
| :--- | :---: | :--- | :--- |
| **Rate Limit / Quota Exceeded** | `200` / `429` | `RATE_LIMIT_EXCEEDED` | Surfaces actionable message: "Gemini rate limit exceeded. Please wait a moment before trying again." Delivers grounded fallback content so UI doesn't crash. |
| **Authentication Failure** | `200` / `401` | `UNAUTHENTICATED` | Surfaces message: "Gemini API authentication failed. Please verify your GEMINI_API_KEY." |
| **Safety Block / Restricted Topic** | `200` | `BLOCKED_BY_SAFETY` | Surfaces message: "Content was blocked by Gemini safety guidelines. Please modify your topic." |
| **Unsupported Audio Format** | `422` | `UNSUPPORTED_AUDIO_FORMAT` | Rejects file immediately with list of valid formats (`WebM, WAV, MP3, OGG, M4A, MP4`). |
| **Audio File Too Large (>25MB)** | `422` | `AUDIO_FILE_TOO_LARGE` | Rejects file with notice to record a shorter brief. |
| **Network / Timeout Failure** | `200` | `CONNECTION_ERROR` | Logs error, applies grounded deterministic template, returns valid structure for graceful UI degradation. |

---

## 4. Test Suite

Run backend test suite:
```bash
cd buffermate-backend
php artisan test --filter=GeminiIntegrationTest
```

### Verified Test Cases:
1. `test_content_posting_generates_multi_platform_copy_successfully`: Verifies JSON schema compliance, hooks, hashtags, and platform variants (Facebook, Instagram, LinkedIn, X, TikTok, Threads).
2. `test_content_posting_handles_rate_limit_explicitly`: Verifies 429 quota handling and graceful degradation.
3. `test_content_posting_handles_safety_blocked_topic`: Verifies detection of safety block reasons (`promptFeedback.blockReason`).
4. `test_voice_feature_extracts_fields_from_audio_file`: Verifies multimodal audio input, transcription, and date/platform extraction.
5. `test_voice_feature_rejects_unsupported_audio_format`: Verifies 422 rejection of unsupported containers.
6. `test_voice_feature_extracts_fields_from_text_brief`: Verifies fallback text brief extraction.
7. `test_image_generation_operates_independently_from_text_modality`: Verifies separate image endpoint, base64 encoding, and aspect ratio handling.
8. `test_image_generation_handles_rate_limit_gracefully`: Verifies rate limit resilience during image synthesis.

