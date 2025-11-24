export interface AIContentRequest {
    topic: string;
    tone?: 'professional' | 'witty' | 'urgent' | 'empathetic' | 'neutral';
    platform?: 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'all';
    length?: 'short' | 'medium' | 'long';
}

export interface AIScriptRequest {
    topic: string;
    tone?: string;
    duration?: string;
}

export interface AIVideoRequest {
    script: string;
    style?: 'cinematic' | 'animated' | 'minimalist' | 'tech';
    voice?: string;
}

export interface AIImageRequest {
    prompt: string;
    style?: string;
    ratio?: string;
}

export interface GeneratedContent {
    title?: string;
    text: string;
    platform?: string;
}

export interface GeneratedScript {
    script: string;
    scenes: {
        scene_number: number;
        description: string;
        dialogue: string;
    }[];
}

export interface GeneratedVideo {
    video_url: string;
    thumbnail_url: string;
    duration: string;
}

export interface GeneratedImage {
    image_url: string;
}

export interface GeneratedTrend {
    topic: string;
    description: string;
    relevance: number; // 0-100
}

export interface GeneratedTime {
    day: string;
    time: string;
    reason: string;
}

export interface AIProvider {
    generateText(request: AIContentRequest): Promise<GeneratedContent[]>;
    generateScript(request: AIScriptRequest): Promise<GeneratedScript>;
    generateVideo(request: AIVideoRequest): Promise<GeneratedVideo>;
    generateImage(request: AIImageRequest): Promise<GeneratedImage>;
    generateTrendingIdeas(topic: string): Promise<GeneratedTrend[]>;
    generateBestTimes(topic: string): Promise<GeneratedTime[]>;
}
