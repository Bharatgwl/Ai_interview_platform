import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const memoryBuckets = globalThis.__intellihireRateBuckets || new Map();
globalThis.__intellihireRateBuckets = memoryBuckets;

const allowedInterviewTypes = new Set([
  "Technical",
  "Behavioural",
  "Experience",
  "Problem Solving",
  "Leadership",
]);

const allowedDurations = new Set(["5", "15", "30", "45", "60"]);

export function jsonError(message, status = 400, details) {
  return NextResponse.json(
    {
      error: message,
      details: process.env.NODE_ENV === "development" ? details : undefined,
    },
    { status }
  );
}

export function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serverKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !serverKey) {
    throw new Error("Missing Supabase server configuration.");
  }

  return createClient(supabaseUrl, serverKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getClientIp(req) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function normalizeOrigin(value) {
  if (!value) return "";
  return value.replace(/\/+$/, "");
}

export function isAllowedOrigin(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  const appOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_HOST_URL);
  const vercelOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

  const allowed = new Set(
    [
      appOrigin,
      normalizeOrigin(vercelOrigin),
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ].filter(Boolean)
  );

  return allowed.has(normalizedOrigin);
}

export function getBearerToken(req) {
  const header = req.headers.get("authorization") || "";
  if (!header.toLowerCase().startsWith("bearer ")) return null;
  return header.slice(7).trim();
}

export async function requireSupabaseUser(req, supabase) {
  const token = getBearerToken(req);
  if (!token) {
    return { error: jsonError("You must be signed in to use this API.", 401) };
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { error: jsonError("Your session is invalid or expired.", 401) };
  }

  return { user: data.user, token };
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function memoryRateLimit(bucketKey, limit, windowMs) {
  const now = Date.now();
  const bucket = memoryBuckets.get(bucketKey) || [];
  const fresh = bucket.filter((time) => now - time < windowMs);
  fresh.push(now);
  memoryBuckets.set(bucketKey, fresh);

  return {
    allowed: fresh.length <= limit,
    remaining: Math.max(limit - fresh.length, 0),
    resetAt: new Date(now + windowMs).toISOString(),
  };
}

export async function rateLimit({
  req,
  supabase,
  scope,
  key,
  limit,
  windowMs,
  userEmail,
}) {
  const keyHash = hash(`${scope}:${key}`);
  const route = new URL(req.url).pathname;
  const since = new Date(Date.now() - windowMs).toISOString();
  const memoryResult = memoryRateLimit(`${scope}:${keyHash}`, limit, windowMs);

  try {
    const { error: insertError } = await supabase.from("api_usage_events").insert({
      scope,
      key_hash: keyHash,
      user_email: userEmail || null,
      route,
      ip_hash: hash(getClientIp(req)),
    });

    if (insertError) throw insertError;

    const { count, error: countError } = await supabase
      .from("api_usage_events")
      .select("id", { count: "exact", head: true })
      .eq("scope", scope)
      .eq("key_hash", keyHash)
      .gte("created_at", since);

    if (countError) throw countError;

    return {
      allowed: (count || 0) <= limit,
      remaining: Math.max(limit - (count || 0), 0),
      resetAt: new Date(Date.now() + windowMs).toISOString(),
    };
  } catch (error) {
    console.warn("Rate limit fallback active:", error.message);
    return memoryResult;
  }
}

export function validateQuestionPayload(input) {
  const jobPosition = String(input?.jobPosition || "").trim();
  const jobDescription = String(input?.jobDescription || "").trim();
  const duration = String(input?.duration || "").trim();
  const rawType = Array.isArray(input?.type) ? input.type : [input?.type];
  const type = rawType.map((item) => String(item || "").trim()).filter(Boolean);

  if (!jobPosition) return { error: "Job position is required." };
  if (jobPosition.length > 120) return { error: "Job position is too long." };
  if (!jobDescription) return { error: "Job description is required." };
  if (jobDescription.length > 3000) return { error: "Job description must be under 3000 characters." };
  if (!allowedDurations.has(duration)) return { error: "Select a valid interview duration." };
  if (type.length === 0) return { error: "Select at least one interview type." };
  if (type.length > 5) return { error: "Too many interview types selected." };
  if (type.some((item) => !allowedInterviewTypes.has(item))) {
    return { error: "Invalid interview type selected." };
  }

  return {
    data: {
      jobPosition,
      jobDescription,
      duration,
      type,
      interviewType: type.join(", "),
    },
  };
}

export function validateFeedbackPayload(input) {
  const conversation = input?.conversation;
  if (!Array.isArray(conversation) || conversation.length === 0) {
    return { data: { conversation: [] } };
  }

  if (conversation.length > 80) {
    return { error: "Conversation is too long to process." };
  }

  const serialized = JSON.stringify(conversation);
  if (serialized.length > 30000) {
    return { error: "Conversation payload is too large." };
  }

  const cleanedConversation = conversation.map((message) => ({
    role: String(message?.role || "unknown").slice(0, 30),
    content: String(message?.content || message?.text || "").slice(0, 4000),
  }));

  return { data: { conversation: cleanedConversation } };
}

export async function ensureCredits({ supabase, email, cost = 1 }) {
  if (!email) return { error: jsonError("Could not identify the signed-in user.", 401) };

  const { data, error } = await supabase
    .from("Users")
    .select("id, credits")
    .eq("email", email)
    .single();

  if (error || !data) {
    return { error: jsonError("User profile was not found.", 403, error?.message) };
  }

  const credits = Number(data.credits || 0);
  if (credits < cost) {
    return { error: jsonError("You do not have enough credits for this action.", 402) };
  }

  return { userRow: data, credits };
}

export async function spendCredit({ supabase, userRow, cost = 1 }) {
  const nextCredits = Math.max(Number(userRow.credits || 0) - cost, 0);
  const { error } = await supabase
    .from("Users")
    .update({ credits: nextCredits })
    .eq("id", userRow.id);

  if (error) {
    console.warn("Failed to spend credit:", error.message);
  }

  return nextCredits;
}

export async function withTimeout(promise, timeoutMs, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

export function parseJsonObject(content) {
  const cleaned = String(content || "").replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const jsonText = start >= 0 && end >= start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(jsonText);
}
