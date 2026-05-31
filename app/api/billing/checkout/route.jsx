import { NextResponse } from "next/server";
import {
  getClientIp,
  getServerSupabase,
  isAllowedOrigin,
  jsonError,
  rateLimit,
  requireSupabaseUser,
} from "@/lib/apiSecurity";
import {
  formBody,
  getAppUrl,
  getConfiguredStripePrice,
  getOrCreateStripeCustomer,
  getPlan,
  getUserBillingRow,
  stripeRequest,
} from "@/lib/billing";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) return jsonError("This origin is not allowed.", 403);

    const { planKey } = await req.json();
    if (!["starter", "pro"].includes(planKey)) {
      return jsonError("Select a valid paid plan.", 400);
    }

    const supabase = getServerSupabase();
    const auth = await requireSupabaseUser(req, supabase);
    if (auth.error) return auth.error;

    const limiter = await rateLimit({
      req,
      supabase,
      scope: "billing-checkout:user",
      key: `${auth.user.email}:${getClientIp(req)}`,
      userEmail: auth.user.email,
      limit: 8,
      windowMs: 60 * 60 * 1000,
    });

    if (!limiter.allowed) {
      return jsonError("Too many checkout attempts. Please wait before trying again.", 429);
    }

    const billing = await getUserBillingRow({ supabase, email: auth.user.email });
    if (billing.error) return billing.error;

    const plan = getPlan(planKey);
    const customerId = await getOrCreateStripeCustomer({
      supabase,
      userRow: billing.userRow,
      email: auth.user.email,
      name: billing.userRow.name || auth.user.user_metadata?.name,
    });

    const appUrl = getAppUrl();
    const priceId = getConfiguredStripePrice(planKey);
    const sessionFields = {
      mode: "subscription",
      customer: customerId,
      success_url: `${appUrl}/billing?checkout=success`,
      cancel_url: `${appUrl}/billing?checkout=cancelled`,
      "metadata[user_email]": auth.user.email,
      "metadata[plan_key]": plan.key,
      "subscription_data[metadata][user_email]": auth.user.email,
      "subscription_data[metadata][plan_key]": plan.key,
      "allow_promotion_codes": "true",
    };

    if (priceId) {
      sessionFields["line_items[0][price]"] = priceId;
      sessionFields["line_items[0][quantity]"] = "1";
    } else {
      sessionFields["line_items[0][price_data][currency]"] = "inr";
      sessionFields["line_items[0][price_data][unit_amount]"] = String(plan.priceInr * 100);
      sessionFields["line_items[0][price_data][recurring][interval]"] = "month";
      sessionFields["line_items[0][price_data][product_data][name]"] = `IntelliHire ${plan.name}`;
      sessionFields["line_items[0][price_data][product_data][metadata][plan_key]"] = plan.key;
      sessionFields["line_items[0][quantity]"] = "1";
    }

    const session = await stripeRequest("/checkout/sessions", {
      method: "POST",
      body: formBody(sessionFields),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    return jsonError("Could not start Stripe checkout.", 500, error.message);
  }
}
