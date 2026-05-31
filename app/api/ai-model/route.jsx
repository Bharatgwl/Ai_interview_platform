import OpenAI from "openai";
import { QUESTION_PROMPT } from "@/services/Constant";
import { NextResponse } from "next/server";
import {
    getClientIp,
    getServerSupabase,
    isAllowedOrigin,
    jsonError,
    parseJsonObject,
    rateLimit,
    requireSupabaseUser,
    validateQuestionPayload,
    withTimeout,
} from "@/lib/apiSecurity";
import { ensureQuestionCredits, spendQuestionCredit } from "@/lib/billing";

const OPENROUTER_TIMEOUT_MS = 30000;

export async function POST(req) {
    try {
        if (!isAllowedOrigin(req)) {
            return jsonError("This origin is not allowed.", 403);
        }

        if (!process.env.API_KEY) {
            return jsonError("AI provider is not configured.", 500);
        }

        const supabase = getServerSupabase();
        const auth = await requireSupabaseUser(req, supabase);
        if (auth.error) return auth.error;

        const body = await req.json();
        const validation = validateQuestionPayload(body);
        if (validation.error) return jsonError(validation.error, 400);

        const userEmail = auth.user.email;
        const userLimiter = await rateLimit({
            req,
            supabase,
            scope: "ai-model:user",
            key: userEmail,
            userEmail,
            limit: 5,
            windowMs: 10 * 60 * 1000,
        });

        if (!userLimiter.allowed) {
            return jsonError("Too many question generations. Please wait a few minutes.", 429);
        }

        const ipLimiter = await rateLimit({
            req,
            supabase,
            scope: "ai-model:ip",
            key: getClientIp(req),
            userEmail,
            limit: 20,
            windowMs: 10 * 60 * 1000,
        });

        if (!ipLimiter.allowed) {
            return jsonError("Too many requests from this network. Please try again later.", 429);
        }

        const creditCheck = await ensureQuestionCredits({ supabase, email: userEmail, cost: 1 });
        if (creditCheck.error) return creditCheck.error;

        const { jobPosition, jobDescription, duration, interviewType } = validation.data;
        const Final_prompt = QUESTION_PROMPT
            .replace('{{jobTitle}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{type}}', interviewType)
            .replace('{{duration}}', duration);

        const openai = new OpenAI({
            apiKey: process.env.API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });

        const completion = await withTimeout(
            openai.chat.completions.create({
                model: process.env.OPENROUTER_MODEL || "openrouter/free",
                messages: [{ role: "user", content: Final_prompt }],
                temperature: 0.4,
                max_tokens: 1800,
            }),
            OPENROUTER_TIMEOUT_MS,
            "The AI provider timed out."
        );

        const rawContent = completion.choices[0]?.message?.content;
        if (!rawContent) {
            throw new Error("No content in AI response.");
        }

        const parsed = parseJsonObject(rawContent);
        if (!parsed.interviewQuestions || !Array.isArray(parsed.interviewQuestions)) {
            throw new Error("Invalid response format: missing interviewQuestions array.");
        }

        const remainingCredits = await spendQuestionCredit({
            supabase,
            userRow: creditCheck.userRow,
            cost: 1,
            metadata: {
                jobPosition,
                duration,
                interviewType,
            },
        });

        return NextResponse.json({
            interviewQuestions: parsed.interviewQuestions.slice(0, 15),
            usage: {
                remainingCredits,
                rateLimitRemaining: userLimiter.remaining,
            },
        });

    } catch (e) {
        console.error("Question generation error:", e.message);
        return jsonError("Failed to generate interview questions.", 500, e.message);
    }
}
