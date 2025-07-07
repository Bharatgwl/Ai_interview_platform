import { FEEDBACK_PROMT } from "@/services/Constant";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    if (!conversation || conversation.length === 0) {
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
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [{ role: "user", content: FINAL_PROMT }],
    });
    return NextResponse.json(completion.choices[0].message); 
    // const rawContent = completion.choices[0].message.content;

    // // Clean JSON output: remove ```json and ``` if present
    // const cleanedContent = rawContent
    //   .replace(/```json|```/g, "")
    //   .trim();

    // const parsedFeedback = JSON.parse(cleanedContent);

    // return NextResponse.json(parsedFeedback, {
    //   status: 200,
    //   headers: { "Content-Type": "application/json" },
    // });

  } catch (e) {
    console.error("AI Parse Error:", e.message);
    return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
  }
}
