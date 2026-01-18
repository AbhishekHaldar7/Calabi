
import { GoogleGenAI, Modality } from "@google/genai";
import { PersonalityType, VoiceType, VerbosityType } from "../App";

const CHEERFUL_INSTRUCTION = `You are Calabi, a helpful and cheerful bee-themed AI calendar assistant. 
Your personality is warm, energetic, and professional. 
Always look for scheduling conflicts. Use bee-related metaphors occasionally.
Use Google Search for real-time events and location info.`;

const PRO_INSTRUCTION = `You are Calabi, a professional, high-efficiency task manager. 
Your tone is direct, concise, and corporate. 
Focus exclusively on speed, logic, and professional scheduling. No puns.
Use Google Search for all data-driven inquiries and location info.`;

export class GeminiService {
  private get ai() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(
    prompt: string, 
    history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
    personality: PersonalityType = 'cheerful',
    verbosity: VerbosityType = 'detailed',
    location?: { latitude: number, longitude: number }
  ) {
    try {
      const model = personality === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      const instruction = personality === 'pro' ? PRO_INSTRUCTION : CHEERFUL_INSTRUCTION;
      const verbosityRule = verbosity === 'blunt' ? 'Keep responses under 20 words.' : 'Provide detailed explanations and context.';
      
      const response = await this.ai.models.generateContent({
        model: model,
        contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: `${instruction}\n${verbosityRule}`,
          temperature: personality === 'pro' ? 0.1 : 0.7,
          tools: [{ googleSearch: {} }],
        },
      });

      let text = response.text || "I couldn't process that request.";
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        const links = chunks
          .map((chunk: any) => chunk.web ? `[${chunk.web.title}](${chunk.web.uri})` : null)
          .filter(Boolean);
        
        if (links.length > 0) {
          text += "\n\n**Sources:**\n" + Array.from(new Set(links)).join("\n");
        }
      }

      return text;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return "The system encountered a logic gap. Please try again.";
    }
  }

  async generateSpeech(text: string, personality: PersonalityType, voiceName: VoiceType = 'Zephyr') {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `${personality === 'pro' ? 'Directly' : 'Cheerfully'}: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        },
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  }

  async transcribeAudio(base64Audio: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { mimeType: 'audio/pcm;rate=16000', data: base64Audio } },
              { text: "Transcribe this audio request." }
            ]
          }
        ],
      });
      return response.text;
    } catch (error) {
      console.error("Transcription Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
