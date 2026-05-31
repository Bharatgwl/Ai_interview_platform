import { NextResponse } from "next/server";
import { getServerSupabase, jsonError, requireSupabaseUser } from "@/lib/apiSecurity";
import { PLAN_CONFIG, getPlan, getUserBillingRow, refreshMonthlyAllowanceIfNeeded } from "@/lib/billing";

export async function GET(req) {
  try {
    const supabase = getServerSupabase();
    const auth = await requireSupabaseUser(req, supabase);
    if (auth.error) return auth.error;

    const billing = await getUserBillingRow({ supabase, email: auth.user.email });
    if (billing.error) return billing.error;

    const userRow = await refreshMonthlyAllowanceIfNeeded({
      supabase,
      userRow: billing.userRow,
    });

    const plan = getPlan(userRow.plan_key);
    const { data: usage } = await supabase
      .from("usage_ledger")
      .select("event_type, quantity, created_at, metadata")
      .eq("user_email", auth.user.email)
      .gte("created_at", userRow.billing_period_start || new Date(0).toISOString())
      .order("created_at", { ascending: false });

    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("plan_key, status, current_period_start, current_period_end, cancel_at_period_end, updated_at")
      .eq("user_email", auth.user.email)
      .order("updated_at", { ascending: false })
      .limit(1);

    const totals = (usage || []).reduce(
      (acc, event) => {
        acc[event.event_type] = Number(acc[event.event_type] || 0) + Number(event.quantity || 0);
        return acc;
      },
      {}
    );

    return NextResponse.json({
      plans: Object.values(PLAN_CONFIG),
      plan,
      user: {
        email: userRow.email,
        name: userRow.name,
        credits: Number(userRow.credits || 0),
        voiceMinutesRemaining: Number(userRow.voice_minutes_remaining || 0),
        subscriptionStatus: userRow.subscription_status || "free",
        billingPeriodStart: userRow.billing_period_start,
        billingPeriodEnd: userRow.billing_period_end,
        hasStripeCustomer: Boolean(userRow.stripe_customer_id),
      },
      usage: {
        questionGenerations: Number(totals.question_generation || 0),
        voiceMinutes: Number(totals.voice_minutes || 0),
        interviewsCreated: Number(totals.interview_created || 0),
      },
      subscription: subscriptions?.[0] || null,
      recentUsage: (usage || []).slice(0, 8),
    });
  } catch (error) {
    console.error("Billing status error:", error.message);
    return jsonError("Could not load billing status.", 500, error.message);
  }
}
