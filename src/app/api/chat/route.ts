import { GoogleGenerativeAI } from "@google/generative-ai";
import { knowledgeBase } from "@/lib/chatbot/knowledge-base";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    const prompt = `You are Naved Sayyed's portfolio assistant. Answer questions about Naved using ONLY the information below. Be concise (2-4 sentences), friendly, and professional.

If the answer isn't in the info below, say you don't have that detail and suggest contacting Naved directly at navedas9356@gmail.com.

INFO ABOUT NAVED:
${knowledgeBase}

USER QUESTION: ${message}`;

    // Retry logic for 503 errors (high demand)
    let retries = 3;
    let lastError: Error | null = null;

    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return Response.json({ response: text });
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string };
        lastError = error as Error;

        // Check if it's a 503 (high demand) error
        if (err?.status === 503 || err?.message?.includes("high demand")) {
          retries--;
          if (retries > 0) {
            console.log(`⚠️ Model busy, retrying... (${retries} attempts left)`);
            // Wait 1 second before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
        }

        // If not 503 or no retries left, throw the error
        throw error;
      }
    }

    // If all retries failed
    throw lastError;
  } catch (error) {
    console.error("Chat API error:", error);

    // User-friendly error messages
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("high demand")) {
      return Response.json(
        { error: "The AI is currently busy. Please try again in a moment." },
        { status: 503 }
      );
    }

    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
