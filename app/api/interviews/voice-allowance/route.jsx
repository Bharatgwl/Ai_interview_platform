import { NextResponse } from "next/server";
import { getClientIp, getServerSupabase, isAllowedOrigin, jsonError, rateLimit } from "@/lib/apiSecurity";
import { ensureVoiceMinutes } from "@/lib/billing";

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) return jsonError("This origin is not allowed.", 403);

    const { interview_id } = await req.json();
    if (!interview_id) return jsonError("Interview id is required.", 400);

    const supabase = getServerSupabase();
    const { data: interview, error } = await supabase
      .from("Interviews")
      .select("duration, userEmail")
      .eq("interview_id", interview_id)
      .single();

    if (error || !interview) return jsonError("Interview was not found.", 404, error?.message);

    const limiter = await rateLimit({
      req,
      supabase,
      scope: "voice-allowance:ip",
      key: `${getClientIp(req)}:${interview_id}`,
      limit: 8,
      windowMs: 60 * 60 * 1000,
      userEmail: interview.userEmail,
    });

    if (!limiter.allowed) {
      return jsonError("Too many attempts for this interview link. Please wait before trying again.", 429);
    }

    const { data: existingFeedback } = await supabase
      .from("interview-feedback")
      .select("id")
      .eq("interview_id", interview_id)
      .limit(1)
      .maybeSingle();

    if (existingFeedback) {
      return jsonError("This interview has already been completed.", 409);
    }

    const requiredMinutes = Number(interview.duration || 0);
    const allowance = await ensureVoiceMinutes({
      supabase,
      email: interview.userEmail,
      requiredMinutes,
    });

    if (allowance.error) return allowance.error;

    return NextResponse.json({
      allowed: true,
      requiredMinutes,
      remainingVoiceMinutes: Number(allowance.userRow.voice_minutes_remaining || 0),
    });
  } catch (error) {
    console.error("Voice allowance error:", error.message);
    return jsonError("Could not verify voice minute allowance.", 500, error.message);
  }
}
