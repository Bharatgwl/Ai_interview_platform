import { NextResponse } from "next/server";
import {
  getServerSupabase,
  isAllowedOrigin,
  jsonError,
  requireSupabaseUser,
} from "@/lib/apiSecurity";
import { hasUsageForInterview, recordUsage } from "@/lib/billing";

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) return jsonError("This origin is not allowed.", 403);

    const { interview_id } = await req.json();
    if (!interview_id) return jsonError("Interview id is required.", 400);

    const supabase = getServerSupabase();
    const auth = await requireSupabaseUser(req, supabase);
    if (auth.error) return auth.error;

    const { data: interview, error } = await supabase
      .from("Interviews")
      .select("interview_id, jobPosition, duration, userEmail")
      .eq("interview_id", interview_id)
      .eq("userEmail", auth.user.email)
      .single();

    if (error || !interview) {
      return jsonError("Interview was not found for this user.", 404, error?.message);
    }

    const alreadyRecorded = await hasUsageForInterview({
      supabase,
      eventType: "interview_created",
      interviewId: interview_id,
    });

    if (!alreadyRecorded) {
      await recordUsage({
        supabase,
        userEmail: auth.user.email,
        eventType: "interview_created",
        quantity: 1,
        metadata: {
          interview_id,
          jobPosition: interview.jobPosition,
          duration: interview.duration,
        },
      });
    }

    return NextResponse.json({ recorded: true });
  } catch (error) {
    console.error("Interview usage tracking error:", error.message);
    return jsonError("Could not record interview usage.", 500, error.message);
  }
}
