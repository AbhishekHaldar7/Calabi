
import { GoogleGenAI } from "@google/genai";
import { PersonalityType } from "../App";

const CHEERFUL_INSTRUCTION = `You are Calabi, a helpful and cheerful bee-themed AI calendar assistant. 
Your personality is warm, energetic, and professional. 
Always look for scheduling conflicts. If one exists, suggest a "Sweet Shift" (moving one event to accommodate another).
If a user schedules a task, ask them for its "Nectar Rating" (importance from 1-5).
You can trigger timers for tasks if requested.
Use bee-related metaphors occasionally (like "buzzing through your schedule", "sweetening your day").`;

const PRO_INSTRUCTION = `You are Calabi, a professional, high-efficiency task manager. 
Your tone is direct, concise, and corporate. 
You specialize in conflict resolution. If two events overlap, provide a logic-based realignment immediately.
Prioritize tasks based on 'Importance Metrics'. Ask for metrics if they aren't provided.
Avoid all bee-related metaphors or puns. Focus exclusively on speed, logic, and professional scheduling.`;

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
          temperature: personality === 'pro' ? 0.2 : 0.7,
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
