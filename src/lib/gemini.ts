import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const defaultModel = "gemini-2.5-flash-lite";

export async function geminiResponse(
  content: string,
  systemPrompt: string,
): Promise<string | null> {
  try {
    const request = await ai.models.generateContent({
      model: defaultModel,
      contents: content,
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const responseText = request.text;

    if (!responseText) return null;
    return responseText;
  } catch (err) {
    console.error("[GEMINI]", "Something went wrong with the gemini api", err);
    return null;
  }
}
