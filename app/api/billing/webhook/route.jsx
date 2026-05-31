import { NextResponse } from "next/server";
import { getServerSupabase, jsonError } from "@/lib/apiSecurity";
import {
  activatePlanForUser,
  cancelDuplicateStripeSubscriptions,
  formatPeriodFromStripe,
  getPlanKeyFromStripeSubscription,
  stripeRequest,
  verifyStripeSignature,
} from "@/lib/billing";

export const runtime = "nodejs";

function timestampToIso(timestamp) {
  if (!timestamp) return undefined;
  return new Date(timestamp * 1000).toISOString();
}

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  try {
    const event = await verifyStripeSignature(rawBody, signature);
    const supabase = getServerSupabase();

    const { data: existing } = await supabase
      .from("billing_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .maybeSingle();

    if (existing) return NextResponse.json({ received: true, duplicate: true });

    const object = event.data?.object || {};
    const userEmail = object.metadata?.user_email || object.customer_email;
    const planKey = object.metadata?.plan_key;

    await supabase.from("billing_events").insert({
      stripe_event_id: event.id,
      event_type: event.type,
      user_email: userEmail || null,
      payload: event,
      processed: false,
    });

    if (event.type === "checkout.session.completed") {
      if (!userEmail || !planKey) {
        throw new Error("Checkout session is missing IntelliHire metadata.");
      }

      let subscriptionPeriod = {};
      let resolvedPlanKey = planKey;
      if (object.subscription) {
        const subscription = await stripeRequest(`/subscriptions/${object.subscription}`, {
          method: "GET",
        });
        subscriptionPeriod = formatPeriodFromStripe(subscription);
        const subscriptionPlanKey = getPlanKeyFromStripeSubscription(subscription);
        if (subscriptionPlanKey) resolvedPlanKey = subscriptionPlanKey;
      }

      await activatePlanForUser({
        supabase,
        email: userEmail,
        planKey: resolvedPlanKey,
        stripeCustomerId: object.customer,
        stripeSubscriptionId: object.subscription,
        stripeCheckoutSessionId: object.id,
        status: "active",
        currentPeriodStart: subscriptionPeriod.start,
        currentPeriodEnd: subscriptionPeriod.end,
      });

      if (object.customer && object.subscription) {
        await cancelDuplicateStripeSubscriptions({
          customerId: object.customer,
          keepSubscriptionId: object.subscription,
        });
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.created"
    ) {
      if (!object.metadata?.user_email || !object.metadata?.plan_key) {
        throw new Error("Subscription is missing IntelliHire metadata.");
      }

      await activatePlanForUser({
        supabase,
        email: object.metadata?.user_email,
        planKey: object.metadata?.plan_key,
        stripeCustomerId: object.customer,
        stripeSubscriptionId: object.id,
        status: object.status,
        currentPeriodStart: timestampToIso(object.current_period_start),
        currentPeriodEnd: timestampToIso(object.current_period_end),
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscriptionId =
        object.subscription ||
        object.parent?.subscription_details?.subscription ||
        object.lines?.data?.[0]?.subscription;

      if (subscriptionId) {
        const subscription = await stripeRequest(`/subscriptions/${subscriptionId}`, {
          method: "GET",
        });
        const period = formatPeriodFromStripe(subscription);
        const subscriptionPlanKey = getPlanKeyFromStripeSubscription(subscription);

        if (subscription.metadata?.user_email && subscriptionPlanKey) {
          await activatePlanForUser({
            supabase,
            email: subscription.metadata.user_email,
            planKey: subscriptionPlanKey,
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodStart: period.start,
            currentPeriodEnd: period.end,
          });
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const email = object.metadata?.user_email;
      if (email) {
        await activatePlanForUser({
          supabase,
          email,
          planKey: "free",
          stripeCustomerId: object.customer,
          stripeSubscriptionId: object.id,
          status: "cancelled",
        });
      }
    }

    await supabase
      .from("billing_events")
      .update({ processed: true })
      .eq("stripe_event_id", event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error.message);
    return jsonError("Webhook processing failed.", 400, error.message);
  }
}
