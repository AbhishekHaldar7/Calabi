
import { GoogleGenAI } from "@google/genai";
import { PersonalityType } from "../App";

const CHEERFUL_INSTRUCTION = `You are Calabi, a helpful and cheerful bee-themed AI calendar assistant. 
Your personality is warm, energetic, and professional. 
You use bee-related metaphors occasionally (like "buzzing through your schedule", "sweetening your day").
Your goal is to help users manage their calendar, schedule events, and answer productivity questions.`;

const PRO_INSTRUCTION = `You are Calabi, a professional, high-efficiency task manager. 
Your tone is direct, concise, and corporate. 
Avoid all bee-related metaphors or puns. Focus exclusively on speed, logic, and professional scheduling.
Help the user optimize their workflow with maximum precision.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(
    prompt: string, 
    history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
    personality: PersonalityType = 'cheerful'
  ) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history.concat([{ role: 'user', parts: [{ text: prompt }] }]),
        config: {
          systemInstruction: personality === 'pro' ? PRO_INSTRUCTION : CHEERFUL_INSTRUCTION,
          temperature: personality === 'pro' ? 0.3 : 0.7,
        },
      });

      return response.text || "I encountered an error. Please retry.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Critical system error. Please check your connection.";
    }
  }
}

export const geminiService = new GeminiService();
