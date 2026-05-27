import { FEEDBACK_PROMT } from "@/services/Constant";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return NextResponse.json({
        feedback: {
          rating: null,
          summary: "No interview was conducted.",
          recommendation: "No",
          recommendationMsg: "The candidate did not participate in the interview."
        }
      });
    }

    const FINAL_PROMT = FEEDBACK_PROMT.replace('{{conversation}}', JSON.stringify(conversation));

    const openai = new OpenAI({
      apiKey: process.env.API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [{ role: "user", content: FINAL_PROMT }],
    });
    
    if (!completion.choices[0]?.message?.content) {
      throw new Error("No content in API response");
    }
    
    return NextResponse.json(completion.choices[0].message); 
   
  } catch (e) {
    console.error("AI Parse Error:", e.message);
    return NextResponse.json({ 
      error: "Failed to parse AI response.",
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    }, { status: 500 });
  }
}
