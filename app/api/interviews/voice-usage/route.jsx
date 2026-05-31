import { NextResponse } from "next/server";
import { getClientIp, getServerSupabase, isAllowedOrigin, jsonError, rateLimit } from "@/lib/apiSecurity";
import { hasUsageForInterview, spendVoiceMinutes } from "@/lib/billing";

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) return jsonError("This origin is not allowed.", 403);

    const { interview_id, elapsedSeconds } = await req.json();
    if (!interview_id) return jsonError("Interview id is required.", 400);

    const seconds = Math.max(Number(elapsedSeconds || 0), 0);
    const billedMinutes = Math.max(1, Math.ceil(seconds / 60));

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
      scope: "voice-usage:ip",
      key: `${getClientIp(req)}:${interview_id}`,
      limit: 4,
      windowMs: 60 * 60 * 1000,
      userEmail: interview.userEmail,
    });

    if (!limiter.allowed) {
      return jsonError("Voice usage was already submitted too many times for this interview.", 429);
    }

    const alreadyRecorded = await hasUsageForInterview({
      supabase,
      eventType: "voice_minutes",
      interviewId: interview_id,
    });

    if (alreadyRecorded) {
      return NextResponse.json({ chargedMinutes: 0, alreadyRecorded: true });
    }

    const maxMinutes = Number(interview.duration || billedMinutes);
    const minutesToCharge = Math.min(billedMinutes, maxMinutes);
    const result = await spendVoiceMinutes({
      supabase,
      userEmail: interview.userEmail,
      minutes: minutesToCharge,
      metadata: {
        interview_id,
        elapsedSeconds: seconds,
        scheduledDuration: maxMinutes,
      },
    });

    if (result.error) return result.error;

    return NextResponse.json({
      chargedMinutes: minutesToCharge,
      remainingVoiceMinutes: result.remainingVoiceMinutes,
    });
  } catch (error) {
    console.error("Voice usage error:", error.message);
    return jsonError("Could not record voice usage.", 500, error.message);
  }
}
