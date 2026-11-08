import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. " +
      "Each question should be separated by '||'. " +
      "These questions are for an anonymous social messaging platform, like Qooh.me, " +
      "and should be suitable for a diverse audience. " +
      "Avoid personal or sensitive topics, focusing instead on universal themes " +
      "that encourage friendly interaction. " +
      "For example: 'What's a hobby you've recently started?||" +
      "If you could have dinner with any historical figure, who would it be?||" +
      "What's a simple thing that makes you happy?'. " +
      "Ensure the questions are intriguing and contribute to a positive, welcoming environment. " +
      "Return only the three questions separated by ||, without numbering or additional text.";

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of response) {
            const text = chunk.text;

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { message: "Failed to generate suggested questions." },
      { status: 500 }
    );
  }
}