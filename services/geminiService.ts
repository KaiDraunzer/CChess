import { GoogleGenAI } from "@google/genai";

export async function getAiMove(fen: string, player: 'white' | 'black'): Promise<string> {
  // Fix: API Key check and client initialization updated to align with guidelines.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `You are a world-class chess grandmaster. Your only goal is to win.
Given the following chess position in FEN format, what is the best move for ${player}?
Respond ONLY with the move in long algebraic notation (e.g., e2e4, e7e8q). Do not add any explanation, commentary, or markdown formatting.

FEN: ${fen}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a powerful model for good chess moves
      contents: prompt,
    });

    const move = response.text.trim();
    // Basic validation for the move format e.g. e2e4 or e7e8q for promotion
    if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move)) {
      console.error("Gemini returned an invalid move format:", move);
      throw new Error(`Invalid move format received from AI: ${move}`);
    }

    return move;
  } catch (error) {
    console.error("Error getting AI move from Gemini:", error);
    throw error;
  }
}
