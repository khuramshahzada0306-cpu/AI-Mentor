import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const generateContentForTopic = async (topic: string, subTopic?: string): Promise<string> => {
    const prompt = `
        Act as an expert IT mentor for a university student.
        Provide a comprehensive and clear explanation of the following topic:
        
        Main Topic: "${topic}"
        ${subTopic ? `Specific Sub-Topic: "${subTopic}"` : ''}

        Your explanation should include:
        1.  A clear, concise definition of the core concepts.
        2.  Key principles or components explained simply.
        3.  A simple, practical code example in a relevant language (e.g., Python for Data Structures, SQL for Databases) to illustrate the concept.
        4.  A brief mention of common use cases or real-world applications.

        Format your response using markdown for readability, including headings, bold text for key terms, and code blocks for examples.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate content from Gemini API.");
    }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    const prompt = `Generate a 5-question multiple-choice quiz on the topic of "${topic}".
        Each question should have 4 options.
        Include the correct answer and a brief, clear explanation for why it's correct.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: "The quiz question." },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "An array of 4 possible answers."
                            },
                            correctAnswer: { type: Type.STRING, description: "The correct answer from the options." },
                            explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." }
                        },
                        required: ["question", "options", "correctAnswer", "explanation"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as QuizQuestion[];

    } catch (error) {
        console.error("Gemini API quiz generation failed:", error);
        throw new Error("Failed to generate quiz from Gemini API.");
    }
};

export const getCodeFeedback = async (code: string, language: string): Promise<string> => {
    const prompt = `
        Act as an expert code reviewer and senior software engineer.
        Analyze the following ${language} code for a university student.
        Provide constructive feedback focusing on:
        1.  **Correctness:** Does the code do what it's supposed to? Are there any bugs?
        2.  **Efficiency:** Can the code be optimized for performance (time or space complexity)?
        3.  **Readability & Style:** Is the code clean, well-formatted, and easy to understand? Adherence to common ${language} conventions.
        4.  **Best Practices:** Are there better or more modern ways to write this code?

        Structure your feedback with clear headings for each point. Be encouraging and educational.
        
        Code to review:
        \`\`\`${language}
        ${code}
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API code feedback failed:", error);
        throw new Error("Failed to get code feedback from Gemini API.");
    }
};

export const generateProjectIdea = async (skillLevel: string, interests: string): Promise<string> => {
    const prompt = `
        Act as a creative project manager for a university IT student.
        Generate a unique and achievable project idea based on the following criteria:

        **Skill Level:** ${skillLevel}
        **Interests:** ${interests}

        The project idea should include:
        1.  **Project Title:** A catchy and descriptive name.
        2.  **Core Concept:** A one-paragraph summary of the project.
        3.  **Key Features:** A bulleted list of 3-5 main features to implement.
        4.  **Recommended Tech Stack:** Suggestions for frontend, backend, database, etc.
        5.  **A "Challenge" Feature:** An optional, more advanced feature to tackle for extra credit.

        Format the response in markdown.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API project generation failed:", error);
        throw new Error("Failed to generate project idea from Gemini API.");
    }
};