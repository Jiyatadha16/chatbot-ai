import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Gemini Mode will not work. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeTextWithGemini = async (text: string): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key is not configured. Please set it up to use this feature.";
  }
  
  try {
    const prompt = `
      Analyze the following text for its emotional tone and provide one brief, constructive suggestion for improving its clarity or impact. 
      Present the analysis in a calm, encouraging, and zen-like manner, as if you are a guide in a peaceful garden.
      Format your response using markdown. Start with a title for the tone (e.g., "**Tone: Reflective Calm**"), followed by your suggestion (e.g., "**A Gentle Suggestion:** ...").
      
      Text to analyze: "${text}"
    `;
    // FIX: Updated contents to be passed as a ContentPart for consistency.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }] }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini.");
  }
};
