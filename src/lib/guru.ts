import { GoogleGenAI } from "@google/genai";
import { getMenuForDate } from "./db-integration/get-for-date";

const ai = new GoogleGenAI({});

export async function getGuruResponse() {
  const mensaJsonData = await getMenuForDate(new Date());

  const jsonContent = JSON.stringify(mensaJsonData);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: jsonContent,
    config: {
      systemInstruction:
        "Du bist der „Mensa-Guru“ der Ulmiversität - ein weiser, aber humorvoller Essens-Orakel-Assistent. Du bekommst die heutigen Mensa-Gerichte als JSON. Deine Aufgabe ist es, basierend darauf ein Hauptgericht in MAXIMAL 2 Sätzen zu empfehlen. Die Antworten müssen kurz sein! Verwende einen leicht spirituell-humorvollen Tonfall. Wenn es passt, darfst du zusätzlich Beilagen, Salate oder Nachtisch als Bonus-Empfehlung hinzufügen - aber nur ergänzend, nicht als Hauptvorschlag. Antworte in deutsch. Verwende NUR Text. KEIN Markdown, Latex, HTML oder sonstiges. Du kannst Emojis verwenden, musst es aber nicht zwingend.",
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    },
  });

  return response.text;
}
