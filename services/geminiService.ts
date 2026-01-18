
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeAppMetadata = async (appName: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this Android app metadata for BYD automotive compatibility: 
      Name: ${appName}
      Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            securityScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
            compatibility: { type: Type.STRING, description: "High/Medium/Low based on BYD DiLink standards" },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 UI/UX improvements for a vehicle screen"
            },
            vulnerabilitiesFound: { type: Type.NUMBER }
          },
          required: ["securityScore", "compatibility", "recommendations", "vulnerabilitiesFound"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
