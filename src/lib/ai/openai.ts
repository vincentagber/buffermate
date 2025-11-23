import OpenAI from 'openai';
import { AIProvider, AIContentRequest, AIScriptRequest, AIVideoRequest, AIImageRequest, GeneratedContent, GeneratedScript, GeneratedVideo, GeneratedImage } from './types';

export class OpenAIProvider implements AIProvider {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({ apiKey });
    }

    async generateText(request: AIContentRequest): Promise<GeneratedContent[]> {
        const { topic, tone = 'professional', platform = 'all' } = request;

        const prompt = `Generate 2 distinct social media posts about "${topic}".
        Tone: ${tone}.
        Platform: ${platform === 'all' ? 'General Social Media' : platform}.
        Format: JSON array with objects containing "title" and "text".`;

        const response = await this.client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a professional social media manager. Return ONLY raw JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        // Parse JSON output (assuming GPT follows instruction)
        // In production, use Zod or similar for robust parsing
        try {
            const parsed = JSON.parse(content);
            // Handle potential variations in GPT's JSON structure
            const posts = Array.isArray(parsed) ? parsed : (parsed.posts || parsed.data || []);
            return posts.map((p: any) => ({
                title: p.title || 'Generated Post',
                text: p.text || p.content || '',
                platform: platform
            }));
        } catch (e) {
            // Fallback if JSON parsing fails
            return [{
                title: 'Generated Post',
                text: content,
                platform: platform
            }];
        }
    }

    async generateScript(request: AIScriptRequest): Promise<GeneratedScript> {
        const { topic, tone = 'engaging' } = request;

        const prompt = `Write a short video script about "${topic}". Tone: ${tone}.
        Include scene descriptions and dialogue.
        Format: JSON object with "script" (full text) and "scenes" (array of {scene_number, description, dialogue}).`;

        const response = await this.client.chat.completions.create({
            model: "gpt-4", // Use GPT-4 for better creative writing
            messages: [
                { role: "system", content: "You are a creative video director. Return ONLY raw JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No script generated");

        const parsed = JSON.parse(content);
        return {
            script: parsed.script || '',
            scenes: parsed.scenes || []
        };
    }

    async generateVideo(request: AIVideoRequest): Promise<GeneratedVideo> {
        // OpenAI doesn't have a public video generation API yet (Sora is preview).
        // We will throw an error or fallback to mock for now, or integrate another provider here.
        // For this demo, we'll simulate it or use a placeholder since we can't actually call Sora.
        throw new Error("OpenAI Video Generation not yet available via API. Please use Mock provider for demo.");
    }

    async generateImage(request: AIImageRequest): Promise<GeneratedImage> {
        const response = await this.client.images.generate({
            model: "dall-e-3",
            prompt: request.prompt,
            n: 1,
            size: "1024x1024",
        });

        return {
            image_url: response.data[0].url || ''
        };
    }
}
