import crypto from "crypto";
import { jsonError } from "@/lib/apiSecurity";

export const PLAN_CONFIG = {
  free: {
    key: "free",
    name: "Free",
    priceInr: 0,
    monthlyInterviewCredits: 3,
    monthlyVoiceMinutes: 15,
  },
  starter: {
    key: "starter",
    name: "Starter",
    priceInr: 499,
    monthlyInterviewCredits: 25,
    monthlyVoiceMinutes: 100,
  },
  pro: {
    key: "pro",
    name: "Pro",
    priceInr: 1499,
    monthlyInterviewCredits: 100,
    monthlyVoiceMinutes: 500,
  },
};

export function getPlan(planKey) {
  return PLAN_CONFIG[planKey] || PLAN_CONFIG.free;
}

export function getConfiguredStripePrice(planKey) {
  if (planKey === "starter") return process.env.STRIPE_STARTER_PRICE_ID;
  if (planKey === "pro") return process.env.STRIPE_PRO_PRICE_ID;
  return null;
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3001")
    .replace(/\/+$/, "")
    .replace(/\/interview$/, "");
}

export async function stripeRequest(path, options = {}) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Stripe request failed.");
  }

  return data;
}

export async function listStripeSubscriptions(customerId) {
  if (!customerId) return [];

  const subscriptions = await stripeRequest(
    `/subscriptions?customer=${encodeURIComponent(customerId)}&status=all&limit=20`,
    { method: "GET" }
  );

  return subscriptions.data || [];
}

export function getStripeSubscriptionAmount(subscription) {
  return Number(subscription?.items?.data?.[0]?.price?.unit_amount || 0);
}

export function getStripeSubscriptionPriceId(subscription) {
  return subscription?.items?.data?.[0]?.price?.id || null;
}

export function getPlanKeyFromStripeSubscription(subscription) {
  const metadataPlan = subscription?.metadata?.plan_key;
  if (metadataPlan && PLAN_CONFIG[metadataPlan]) return metadataPlan;

  const priceId = getStripeSubscriptionPriceId(subscription);
  if (priceId && priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId && priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";

  const amount = getStripeSubscriptionAmount(subscription);
  if (amount === PLAN_CONFIG.starter.priceInr * 100) return "starter";
  if (amount === PLAN_CONFIG.pro.priceInr * 100) return "pro";

  return null;
}

export function pickBestStripeSubscription(subscriptions = []) {
  const activeSubscriptions = subscriptions.filter((subscription) =>
    ["active", "trialing", "past_due"].includes(subscription.status)
  );

  return activeSubscriptions.sort((a, b) => {
    const aPlan = getPlan(getPlanKeyFromStripeSubscription(a));
    const bPlan = getPlan(getPlanKeyFromStripeSubscription(b));
    const amountDiff =
      (getStripeSubscriptionAmount(b) || bPlan.priceInr * 100) -
      (getStripeSubscriptionAmount(a) || aPlan.priceInr * 100);
    if (amountDiff !== 0) return amountDiff;
    return Number(b.created || 0) - Number(a.created || 0);
  })[0];
}

export async function cancelDuplicateStripeSubscriptions({ customerId, keepSubscriptionId }) {
  const subscriptions = await listStripeSubscriptions(customerId);
  const cancellable = subscriptions.filter(
    (subscription) =>
      subscription.id !== keepSubscriptionId &&
      ["active", "trialing", "past_due"].includes(subscription.status)
  );

  for (const subscription of cancellable) {
    await stripeRequest(`/subscriptions/${subscription.id}`, {
      method: "DELETE",
    });
  }

  return cancellable.map((subscription) => subscription.id);
}

export function formBody(fields) {
  const params = new URLSearchParams();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.append(key, String(value));
  });

  return params.toString();
}

export async function createStripeCustomer({ email, name }) {
  return stripeRequest("/customers", {
    method: "POST",
    body: formBody({
      email,
      name,
      "metadata[app]": "intellihire",
    }),
  });
}

export async function getOrCreateStripeCustomer({ supabase, userRow, email, name }) {
  if (userRow?.stripe_customer_id) return userRow.stripe_customer_id;

  const customer = await createStripeCustomer({ email, name });
  await supabase
    .from("Users")
    .update({ stripe_customer_id: customer.id })
    .eq("email", email);

  return customer.id;
}

export async function getUserBillingRow({ supabase, email }) {
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return { error: jsonError("User profile was not found.", 403, error?.message) };
  }

  return { userRow: data };
}

function hasPeriodExpired(userRow) {
  if (!userRow?.billing_period_end) return true;
  return new Date(userRow.billing_period_end).getTime() < Date.now();
}

function nextPeriod() {
  const start = new Date();
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function formatPeriodFromStripe(subscription) {
  return {
    start: subscription?.current_period_start
      ? new Date(subscription.current_period_start * 1000).toISOString()
      : undefined,
    end: subscription?.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : undefined,
  };
}

export async function refreshMonthlyAllowanceIfNeeded({ supabase, userRow }) {
  if (!hasPeriodExpired(userRow)) return userRow;

  const plan = getPlan(userRow.plan_key);
  const period = nextPeriod();
  const update = {
    credits: plan.monthlyInterviewCredits,
    voice_minutes_remaining: plan.monthlyVoiceMinutes,
    billing_period_start: period.start,
    billing_period_end: period.end,
  };

  const { data, error } = await supabase
    .from("Users")
    .update(update)
    .eq("id", userRow.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function ensureQuestionCredits({ supabase, email, cost = 1 }) {
  const result = await getUserBillingRow({ supabase, email });
  if (result.error) return result;

  const userRow = await refreshMonthlyAllowanceIfNeeded({
    supabase,
    userRow: result.userRow,
  });

  if (Number(userRow.credits || 0) < cost) {
    return { error: jsonError("You have used all interview credits for this billing period.", 402) };
  }

  return { userRow };
}

export async function spendQuestionCredit({ supabase, userRow, metadata = {}, cost = 1 }) {
  const nextCredits = Math.max(Number(userRow.credits || 0) - cost, 0);
  await supabase.from("Users").update({ credits: nextCredits }).eq("id", userRow.id);
  await recordUsage({
    supabase,
    userEmail: userRow.email,
    eventType: "question_generation",
    quantity: cost,
    planKey: userRow.plan_key,
    metadata,
  });
  return nextCredits;
}

export async function ensureVoiceMinutes({ supabase, email, requiredMinutes }) {
  const result = await getUserBillingRow({ supabase, email });
  if (result.error) return result;

  const userRow = await refreshMonthlyAllowanceIfNeeded({
    supabase,
    userRow: result.userRow,
  });

  if (Number(userRow.voice_minutes_remaining || 0) < requiredMinutes) {
    return { error: jsonError("Not enough voice minutes remaining for this interview.", 402) };
  }

  return { userRow };
}

export async function spendVoiceMinutes({ supabase, userEmail, minutes, metadata = {} }) {
  const result = await getUserBillingRow({ supabase, email: userEmail });
  if (result.error) return result;

  const userRow = await refreshMonthlyAllowanceIfNeeded({
    supabase,
    userRow: result.userRow,
  });
  const nextMinutes = Math.max(Number(userRow.voice_minutes_remaining || 0) - minutes, 0);

  await supabase
    .from("Users")
    .update({ voice_minutes_remaining: nextMinutes })
    .eq("id", userRow.id);

  await recordUsage({
    supabase,
    userEmail,
    eventType: "voice_minutes",
    quantity: minutes,
    planKey: userRow.plan_key,
    metadata,
  });

  return { remainingVoiceMinutes: nextMinutes };
}

export async function recordUsage({ supabase, userEmail, eventType, quantity = 1, planKey, metadata = {} }) {
  await supabase.from("usage_ledger").insert({
    user_email: userEmail,
    event_type: eventType,
    quantity,
    plan_key: planKey || null,
    metadata,
  });
}

export async function hasUsageForInterview({ supabase, eventType, interviewId }) {
  if (!interviewId) return false;

  const { data, error } = await supabase
    .from("usage_ledger")
    .select("id")
    .eq("event_type", eventType)
    .contains("metadata", { interview_id: interviewId })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("Usage lookup failed:", error.message);
    return false;
  }

  return Boolean(data);
}

export async function activatePlanForUser({
  supabase,
  email,
  planKey,
  stripeCustomerId,
  stripeSubscriptionId,
  stripeCheckoutSessionId,
  status = "active",
  currentPeriodStart,
  currentPeriodEnd,
}) {
  const plan = getPlan(planKey);
  const fallbackPeriod = nextPeriod();
  const period = {
    start: currentPeriodStart || fallbackPeriod.start,
    end: currentPeriodEnd || fallbackPeriod.end,
  };

  const { error: planUpsertError } = await supabase.from("plans").upsert(
    {
      plan_key: plan.key,
      name: plan.name,
      price_inr: plan.priceInr,
      interval: "month",
      monthly_interview_credits: plan.monthlyInterviewCredits,
      monthly_voice_minutes: plan.monthlyVoiceMinutes,
      active: true,
    },
    { onConflict: "plan_key" }
  );

  if (planUpsertError) {
    throw new Error(`Failed to ensure billing plan exists: ${planUpsertError.message}`);
  }

  const { error: userUpdateError } = await supabase
    .from("Users")
    .update({
      plan_key: plan.key,
      credits: plan.monthlyInterviewCredits,
      voice_minutes_remaining: plan.monthlyVoiceMinutes,
      billing_period_start: period.start,
      billing_period_end: period.end,
      stripe_customer_id: stripeCustomerId || null,
      stripe_subscription_id: stripeSubscriptionId || null,
      subscription_status: status,
    })
    .eq("email", email);

  if (userUpdateError) {
    throw new Error(`Failed to update user billing state: ${userUpdateError.message}`);
  }

  const subscriptionPayload = {
    user_email: email,
    plan_key: plan.key,
    status,
    stripe_customer_id: stripeCustomerId || null,
    stripe_subscription_id: stripeSubscriptionId || null,
    stripe_checkout_session_id: stripeCheckoutSessionId || null,
    current_period_start: period.start,
    current_period_end: period.end,
    updated_at: new Date().toISOString(),
  };

  let subscriptionError;

  if (stripeSubscriptionId) {
    const { error } = await supabase
      .from("subscriptions")
      .upsert(subscriptionPayload, { onConflict: "stripe_subscription_id" });
    subscriptionError = error;
  } else {
    const { error } = await supabase.from("subscriptions").insert(subscriptionPayload);
    subscriptionError = error;
  }

  if (subscriptionError) {
    throw new Error(`Failed to upsert subscription: ${subscriptionError.message}`);
  }
}

export async function verifyStripeSignature(rawBody, signatureHeader) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
  if (!signatureHeader) throw new Error("Missing Stripe signature.");

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((item) => {
      const [key, value] = item.split("=");
      return [key, value];
    })
  );

  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) throw new Error("Invalid Stripe signature header.");

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    throw new Error("Stripe webhook signature verification failed.");
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (ageSeconds > 300) throw new Error("Stripe webhook signature is too old.");

  return JSON.parse(rawBody);
}
