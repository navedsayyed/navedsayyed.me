import { GoogleGenerativeAI } from "@google/generative-ai";
import { knowledgeBase } from "@/lib/chatbot/knowledge-base";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Debug: Check if API key exists
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }
    
    console.log("API Key exists, length:", apiKey.length);
    console.log("API Key starts with:", apiKey.substring(0, 10));

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use the same model as Snap2Fix
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

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return Response.json({ response: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
