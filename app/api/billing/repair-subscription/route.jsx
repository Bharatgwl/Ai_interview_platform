import { NextResponse } from "next/server";
import {
  getServerSupabase,
  isAllowedOrigin,
  jsonError,
  requireSupabaseUser,
} from "@/lib/apiSecurity";
import {
  activatePlanForUser,
  cancelDuplicateStripeSubscriptions,
  formatPeriodFromStripe,
  getPlanKeyFromStripeSubscription,
  getUserBillingRow,
  listStripeSubscriptions,
  pickBestStripeSubscription,
} from "@/lib/billing";

export const runtime = "nodejs";

function inferPlanKey(subscription) {
  return getPlanKeyFromStripeSubscription(subscription);
}

export async function POST(req) {
  try {
    if (!isAllowedOrigin(req)) return jsonError("This origin is not allowed.", 403);

    const supabase = getServerSupabase();
    const auth = await requireSupabaseUser(req, supabase);
    if (auth.error) return auth.error;

    const billing = await getUserBillingRow({ supabase, email: auth.user.email });
    if (billing.error) return billing.error;

    const customerId = billing.userRow.stripe_customer_id;
    if (!customerId) {
      return jsonError("This user does not have a Stripe customer yet.", 400);
    }

    const subscriptions = await listStripeSubscriptions(customerId);
    const activeSubscription = pickBestStripeSubscription(subscriptions);

    if (!activeSubscription) {
      return jsonError("No active Stripe subscription was found for this user.", 404);
    }

    const period = formatPeriodFromStripe(activeSubscription);
    const planKey = inferPlanKey(activeSubscription);
    if (!planKey) {
      return jsonError(
        "Could not identify whether this Stripe subscription is Starter or Pro. Check STRIPE_STARTER_PRICE_ID and STRIPE_PRO_PRICE_ID.",
        422
      );
    }

    await activatePlanForUser({
      supabase,
      email: auth.user.email,
      planKey,
      stripeCustomerId: customerId,
      stripeSubscriptionId: activeSubscription.id,
      status: activeSubscription.status,
      currentPeriodStart: period.start,
      currentPeriodEnd: period.end,
    });

    const cancelledSubscriptionIds = await cancelDuplicateStripeSubscriptions({
      customerId,
      keepSubscriptionId: activeSubscription.id,
    });

    return NextResponse.json({
      repaired: true,
      subscriptionId: activeSubscription.id,
      planKey,
      status: activeSubscription.status,
      cancelledSubscriptionIds,
    });
  } catch (error) {
    console.error("Subscription repair error:", error.message);
    return jsonError("Could not repair subscription state.", 500, error.message);
  }
}
