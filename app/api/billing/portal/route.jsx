import { NextResponse } from "next/server";
import {
  getClientIp,
  getServerSupabase,
  isAllowedOrigin,
  jsonError,
  rateLimit,
  requireSupabaseUser,
} from "@/lib/apiSecurity";
import { formBody, getAppUrl, getUserBillingRow, stripeRequest } from "@/lib/billing";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) return jsonError("This origin is not allowed.", 403);

    const supabase = getServerSupabase();
    const auth = await requireSupabaseUser(req, supabase);
    if (auth.error) return auth.error;

    const limiter = await rateLimit({
      req,
      supabase,
      scope: "billing-portal:user",
      key: `${auth.user.email}:${getClientIp(req)}`,
      userEmail: auth.user.email,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });

    if (!limiter.allowed) {
      return jsonError("Too many billing portal attempts. Please wait before trying again.", 429);
    }

    const billing = await getUserBillingRow({ supabase, email: auth.user.email });
    if (billing.error) return billing.error;

    const { data: latestSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id, plan_key, status, updated_at")
      .eq("user_email", auth.user.email)
      .in("status", ["active", "trialing", "past_due"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const customerId =
      latestSubscription?.stripe_customer_id || billing.userRow.stripe_customer_id;

    if (!customerId) {
      return jsonError("No Stripe customer exists for this account yet.", 400);
    }

    if (customerId !== billing.userRow.stripe_customer_id) {
      await supabase
        .from("Users")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id:
            latestSubscription?.stripe_subscription_id || billing.userRow.stripe_subscription_id,
          plan_key: latestSubscription?.plan_key || billing.userRow.plan_key,
          subscription_status: latestSubscription?.status || billing.userRow.subscription_status,
        })
        .eq("email", auth.user.email);
    }

    const session = await stripeRequest("/billing_portal/sessions", {
      method: "POST",
      body: formBody({
        customer: customerId,
        return_url: `${getAppUrl()}/billing`,
      }),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error.message);
    return jsonError("Could not open the billing portal.", 500, error.message);
  }
}
