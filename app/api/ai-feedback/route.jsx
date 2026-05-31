import { FEEDBACK_PROMT } from "@/services/Constant";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  getClientIp,
  getServerSupabase,
  isAllowedOrigin,
  jsonError,
  rateLimit,
  validateFeedbackPayload,
  withTimeout,
} from "@/lib/apiSecurity";

const OPENROUTER_TIMEOUT_MS = 30000;

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) {
      return jsonError("This origin is not allowed.", 403);
    }

    if (!process.env.API_KEY) {
      return jsonError("AI provider is not configured.", 500);
    }

    const body = await req.json();
    const validation = validateFeedbackPayload(body);
    if (validation.error) return jsonError(validation.error, 400);

    const { conversation } = validation.data;

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

    const supabase = getServerSupabase();
    const limiter = await rateLimit({
      req,
      supabase,
      scope: "ai-feedback:ip",
      key: `${getClientIp(req)}:${body?.interview_id || "unknown"}`,
      limit: 8,
      windowMs: 60 * 60 * 1000,
    });

    if (!limiter.allowed) {
      return jsonError("Too many feedback requests. Please try again later.", 429);
    }

    const FINAL_PROMT = FEEDBACK_PROMT.replace('{{conversation}}', JSON.stringify(conversation));

    const openai = new OpenAI({
      apiKey: process.env.API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await withTimeout(
      openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || "openrouter/free",
        messages: [{ role: "user", content: FINAL_PROMT }],
        temperature: 0.2,
        max_tokens: 1200,
      }),
      OPENROUTER_TIMEOUT_MS,
      "The AI provider timed out."
    );

    if (!completion.choices[0]?.message?.content) {
      throw new Error("No content in AI response.");
    }

    return NextResponse.json(completion.choices[0].message);

  } catch (e) {
    console.error("Feedback generation error:", e.message);
    return jsonError("Failed to generate AI feedback.", 500, e.message);
  }
}
