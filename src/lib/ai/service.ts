import { AIProvider } from './types';
import { OpenAIProvider } from './openai';
import { MockAIProvider } from './mock';

export class AIService {
    private static instance: AIProvider;

    static getInstance(): AIProvider {
        if (!this.instance) {
            const apiKey = process.env.OPENAI_API_KEY;
            // Check if we should force mock mode (useful for dev/testing even if key exists)
            const forceMock = process.env.AI_FORCE_MOCK === 'true';

            if (apiKey && !forceMock) {
                console.log('Initializing OpenAI Provider');
                this.instance = new OpenAIProvider(apiKey);
            } else {
                console.log('Initializing Mock AI Provider');
                this.instance = new MockAIProvider();
            }
        }
        return this.instance;
    }
}
