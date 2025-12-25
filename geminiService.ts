
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Always initialize inside functions or ensure process.env.API_KEY is available
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartFinancialAdvice = async (history: string, balance: number) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this user's financial status and give one short tip. Current Balance: ₹${balance}. Recent Transactions Summary: ${history}`,
      config: {
        systemInstruction: "You are a friendly financial assistant for GeminiPay. Keep advice short (under 15 words) and actionable.",
      }
    });
    return response.text || "Keep track of your daily spending!";
  } catch (e) {
    console.error("Gemini Advice Error:", e);
    return "Ready to help with your finances.";
  }
};

export const chatWithGemini = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text;
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
