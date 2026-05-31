import { NextResponse } from "next/server";
import { getServerSupabase, isAllowedOrigin, jsonError, requireSupabaseUser } from "@/lib/apiSecurity";

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) return jsonError("This origin is not allowed.", 403);

    const supabase = getServerSupabase();
    const auth = await requireSupabaseUser(req, supabase);
    if (auth.error) return auth.error;

    const metadata = auth.user.user_metadata || {};
    const profile = {
      email: auth.user.email,
      name: metadata.name || metadata.full_name || auth.user.email?.split("@")[0] || "Recruiter",
      picture: metadata.picture || metadata.avatar_url || null,
      credits: 3,
      plan_key: "free",
      voice_minutes_remaining: 15,
      subscription_status: "free",
    };

    const { data: existing, error: lookupError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", auth.user.email)
      .maybeSingle();

    if (lookupError) {
      return jsonError("Could not load user profile.", 500, lookupError.message);
    }

    if (existing) {
      const { data, error } = await supabase
        .from("Users")
        .update({
          name: existing.name || profile.name,
          picture: existing.picture || profile.picture,
          credits: existing.credits ?? profile.credits,
          plan_key: existing.plan_key || profile.plan_key,
          voice_minutes_remaining:
            existing.voice_minutes_remaining ?? profile.voice_minutes_remaining,
          subscription_status: existing.subscription_status || profile.subscription_status,
        })
        .eq("email", auth.user.email)
        .select("*")
        .single();

      if (error) return jsonError("Could not update user profile.", 500, error.message);
      return NextResponse.json({ user: data });
    }

    const { data, error } = await supabase
      .from("Users")
      .insert([profile])
      .select("*")
      .single();

    if (error) return jsonError("Could not create user profile.", 500, error.message);
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("User sync error:", error.message);
    return jsonError("Could not sync user profile.", 500, error.message);
  }
}
