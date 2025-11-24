import { AIProvider, AIContentRequest, AIScriptRequest, AIVideoRequest, AIImageRequest, GeneratedContent, GeneratedScript, GeneratedVideo, GeneratedImage, GeneratedTrend, GeneratedTime } from './types';

export class MockAIProvider implements AIProvider {
    async generateText(request: AIContentRequest): Promise<GeneratedContent[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const { topic, tone = 'professional', platform = 'linkedin' } = request;

        const templates: Record<string, string[]> = {
            professional: [
                `🚀 Unlocking the potential of ${topic}.\n\nIn today's rapidly evolving landscape, understanding ${topic} is more critical than ever. It's not just about keeping up; it's about leading the charge.\n\nHere are 3 key takeaways:\n1️⃣ Efficiency is king.\n2️⃣ Innovation drives growth.\n3️⃣ Adaptability wins.\n\nHow are you leveraging ${topic} in your strategy? 👇\n\n#Leadership #Innovation #${topic.replace(/\s+/g, '')}`,
                `💡 The truth about ${topic} that no one talks about.\n\nWe often get caught up in the hype, but the real value lies in the execution. When I look at successful implementations of ${topic}, I see one common thread: consistency.\n\nWhat's your biggest challenge with ${topic} right now? Let's discuss. ⬇️`,
                `Big changes are coming to ${topic}. Are you ready?\n\nI've been analyzing the trends, and the shift towards more integrated solutions is undeniable. If you're not prioritizing ${topic} this quarter, you might be falling behind.\n\n#FutureOfWork #Strategy #${topic.replace(/\s+/g, '')}`
            ],
            witty: [
                `They said "${topic}" would be easy. They lied. 😂\n\nBut seriously, once you get past the initial hurdle, it's a game changer. Who else has a love-hate relationship with ${topic}? 🙋‍♂️\n\n#TechLife #RealTalk #${topic.replace(/\s+/g, '')}`,
                `If I had a dollar for every time someone asked me about ${topic}... I'd probably buy more coffee. ☕️\n\nHere's the simple version: It works if you work it. What's your hot take on ${topic}?\n\n#MondayMotivation #CoffeeTalk`,
                `Trying to explain ${topic} to my grandma like... 🤯\n\nIt's complicated, but essential. Here's why you should care (in plain English). 👇\n\n#Simplify #${topic.replace(/\s+/g, '')}`
            ],
            urgent: [
                `⚠️ STOP ignoring ${topic}.\n\nThe window of opportunity is closing faster than you think. Early adopters are already seeing massive ROI. Don't be the one playing catch-up next year.\n\nStart today. Here's how. 👇\n\n#Urgent #GrowthHacking #${topic.replace(/\s+/g, '')}`,
                `The ${topic} revolution is HERE. 🚨\n\nWaiting for "the right time"? It was yesterday. The second best time is now. Let's get moving.\n\n#ActionTakers #BusinessGrowth`
            ],
            empathetic: [
                `I know ${topic} can be overwhelming. I've been there. ❤️\n\nIt's okay to feel unsure. The journey to mastering ${topic} isn't a straight line. Remember to celebrate the small wins along the way.\n\nYou've got this. 💪\n\n#Mindset #Growth #Support`,
                `Let's take a deep breath and talk about ${topic}. 🌿\n\nIt doesn't have to be stressful. By breaking it down into manageable steps, we can find clarity in the chaos.\n\nHow are you feeling about your progress today?`
            ],
            neutral: [
                `Let's discuss ${topic}.\n\nIt's a broad subject with many nuances. From my perspective, the most interesting aspect is how it intersects with daily productivity.\n\nWhat are your thoughts? #Discussion #${topic.replace(/\s+/g, '')}`,
                `A quick update on ${topic}.\n\nRecent developments suggest a shift in how we approach this. It's worth keeping an eye on.\n\n#Update #IndustryNews`
            ]
        };

        const selectedTemplates = templates[tone] || templates.neutral;
        // Return 2 distinct variations
        return [
            {
                title: `Option 1 (${tone})`,
                text: selectedTemplates[0],
                platform: platform
            },
            {
                title: `Option 2 (${tone})`,
                text: selectedTemplates[1] || selectedTemplates[0], // Fallback if only 1 template
                platform: platform
            }
        ];
    }

    async generateScript(request: AIScriptRequest): Promise<GeneratedScript> {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const { topic } = request;

        return {
            script: `[SCENE START]\n\n**INT. MODERN OFFICE - DAY**\n\nHOST\n(Looking directly at camera)\nSo, you've heard about ${topic}, but do you know what it really means for your business?\n\n[CUT TO B-ROLL of busy office/tech]\n\nNARRATOR (V.O.)\nIt's more than just a buzzword. ${topic} is the key to unlocking efficiency in 2025.\n\n[CUT TO HOST]\n\nHOST\nLet's break it down into three simple steps.\n\n[SCENE END]`,
            scenes: [
                {
                    scene_number: 1,
                    description: "Host intro in a modern office setting, well-lit.",
                    dialogue: `So, you've heard about ${topic}, but do you know what it really means for your business?`
                },
                {
                    scene_number: 2,
                    description: "B-Roll montage of technology and productivity.",
                    dialogue: `It's more than just a buzzword. ${topic} is the key to unlocking efficiency in 2025.`
                },
                {
                    scene_number: 3,
                    description: "Host returns to frame for the breakdown.",
                    dialogue: "Let's break it down into three simple steps."
                }
            ]
        };
    }

    async generateVideo(request: AIVideoRequest): Promise<GeneratedVideo> {
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Return different "mock" videos based on style keywords if we had them, 
        // but for now we'll use high-quality stock placeholders.
        const videos = {
            cinematic: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            animated: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            tech: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            minimalist: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        };

        const thumbnails = {
            cinematic: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
            animated: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
            tech: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
            minimalist: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg"
        };

        const style = request.style || 'cinematic';

        return {
            video_url: videos[style] || videos.cinematic,
            thumbnail_url: thumbnails[style] || thumbnails.cinematic,
            duration: "00:45"
        };
    }

    async generateImage(request: AIImageRequest): Promise<GeneratedImage> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            image_url: `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/1024/1024`
        };
    }

    async generateTrendingIdeas(topic: string): Promise<GeneratedTrend[]> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { topic: `${topic} Trends 2025`, description: `The latest shifts in ${topic} landscape.`, relevance: 98 },
            { topic: `AI in ${topic}`, description: `How artificial intelligence is reshaping ${topic}.`, relevance: 95 },
            { topic: `Sustainable ${topic}`, description: `Eco-friendly approaches to ${topic}.`, relevance: 88 },
            { topic: `Remote ${topic}`, description: `Managing ${topic} from anywhere.`, relevance: 85 },
            { topic: `${topic} for Beginners`, description: `A complete guide to starting with ${topic}.`, relevance: 80 }
        ];
    }

    async generateBestTimes(topic: string): Promise<GeneratedTime[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [
            { day: "Tuesday", time: "10:00 AM", reason: "Highest engagement for B2B content." },
            { day: "Thursday", time: "2:00 PM", reason: "Good for catching people after lunch." },
            { day: "Wednesday", time: "9:00 AM", reason: "Mid-week peak activity." }
        ];
    }
}
