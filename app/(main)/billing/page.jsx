"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Check, CreditCard, Crown, Loader2, Sparkles, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";

const fallbackPlans = [
  {
    key: "free",
    name: "Free",
    priceInr: 0,
    monthlyInterviewCredits: 3,
    monthlyVoiceMinutes: 15,
  },
  {
    key: "starter",
    name: "Starter",
    priceInr: 499,
    monthlyInterviewCredits: 25,
    monthlyVoiceMinutes: 100,
  },
  {
    key: "pro",
    name: "Pro",
    priceInr: 1499,
    monthlyInterviewCredits: 100,
    monthlyVoiceMinutes: 500,
  },
];

function formatDate(value) {
  if (!value) return "Not started";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function percent(used, total) {
  if (!total) return 0;
  return Math.min(Math.round((Number(used || 0) / Number(total || 1)) * 100), 100);
}

function BillingPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const plans = useMemo(() => status?.plans || fallbackPlans, [status]);
  const currentPlanKey = status?.plan?.key || "free";
  const currentPlan = status?.plan || plans.find((plan) => plan.key === currentPlanKey) || fallbackPlans[0];
  const usedCredits = status?.usage?.questionGenerations || 0;
  const usedVoice = status?.usage?.voiceMinutes || 0;
  const creditPercent = percent(usedCredits, currentPlan.monthlyInterviewCredits);
  const voicePercent = percent(usedVoice, currentPlan.monthlyVoiceMinutes);

  const getAuthToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token;
  };

  const loadBilling = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        toast.error("Please sign in again to view billing.");
        return;
      }

      const { data } = await axios.get("/api/billing/status", {
        headers: { Authorization: `Bearer ${token}` },
      }); 
      setStatus(data);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not load billing status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const startCheckout = async (planKey) => {
    try {
      setBusyPlan(planKey);
      const token = await getAuthToken();
      if (!token) {
        toast.error("Please sign in again before upgrading.");
        return;
      }

      const { data } = await axios.post(
        "/api/billing/checkout",
        { planKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.url) window.location.href = data.url;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not start checkout.");
    } finally {
      setBusyPlan(null);
    }
  };

  const openPortal = async () => {
    try {
      setPortalLoading(true);
      const token = await getAuthToken();
      if (!token) {
        toast.error("Please sign in again before opening billing.");
        return;
      }

      const { data } = await axios.post(
        "/api/billing/portal",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.url) window.location.href = data.url;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Could not open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="!space-y-6">
      <div className="flex flex-col justify-between !gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Billing</p>
          <h2 className="text-3xl font-bold text-slate-950">Plans and usage</h2>
          <p className="!mt-2 text-sm text-slate-500">
            Control interview credits, voice minutes, and Stripe subscription access from one place.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={openPortal}
          disabled={portalLoading || !status?.user?.hasStripeCustomer}
          className="!h-11 rounded-lg !bg-black !p-3 !text-white hover:!bg-white hover:!text-black"
        >
          {portalLoading ? <Loader2 className="!h-4 !w-4 animate-spin" /> : <WalletCards className="!h-4 !w-4" />}
          Manage Stripe billing
        </Button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-slate-950 !p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between !gap-5 lg:flex-row lg:items-center">
          <div className="flex items-center !gap-4">
            <div className="flex !h-12 !w-12 items-center justify-center rounded-xl bg-white/10">
              <Crown className="!h-6 !w-6 text-amber-300" />
            </div>
            <div>
              <p className="text-sm text-slate-300">Current plan</p>
              <h3 className="text-2xl font-bold">{loading ? "Loading..." : currentPlan.name}</h3>
            </div>
          </div>
          <div className="grid !gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 !px-4 !py-3">
              <p className="text-xs text-slate-300">Credits left</p>
              <p className="!mt-1 text-xl font-bold">{status?.user?.credits ?? "-"}</p>
            </div>
            <div className="rounded-xl bg-white/10 !px-4 !py-3">
              <p className="text-xs text-slate-300">Voice minutes left</p>
              <p className="!mt-1 text-xl font-bold">{status?.user?.voiceMinutesRemaining ?? "-"}</p>
            </div>
            <div className="rounded-xl bg-white/10 !px-4 !py-3">
              <p className="text-xs text-slate-300">Renews on</p>
              <p className="!mt-1 text-sm font-semibold">{formatDate(status?.user?.billingPeriodEnd)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid !gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="grid !gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.key === currentPlanKey;
            const isPaid = plan.key !== "free";
            return (
              <article
                key={plan.key}
                className={`rounded-2xl border bg-white !p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                  isCurrent ? "border-slate-950 ring-2 ring-slate-950/10" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between !gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
                    <p className="!mt-1 text-sm text-slate-500">{isPaid ? "Monthly subscription" : "Try the workflow"}</p>
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-emerald-50 !px-3 !py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  )}
                </div>
                <div className="!mt-5">
                  <span className="text-3xl font-bold text-slate-950">Rs {plan.priceInr}</span>
                  <span className="text-sm text-slate-500"> /mo</span>
                </div>
                <div className="!mt-5 !space-y-3 text-sm text-slate-700">
                  <p className="flex items-center !gap-2">
                    <Check className="!h-4 !w-4 text-emerald-600" />
                    {plan.monthlyInterviewCredits} interview credits
                  </p>
                  <p className="flex items-center !gap-2">
                    <Check className="!h-4 !w-4 text-emerald-600" />
                    {plan.monthlyVoiceMinutes} voice minutes
                  </p>
                  <p className="flex items-center !gap-2">
                    <Check className="!h-4 !w-4 text-emerald-600" />
                    AI question generation and feedback
                  </p>
                </div>
                <Button
                  disabled={loading || isCurrent || !isPaid || busyPlan === plan.key}
                  onClick={() => startCheckout(plan.key)}
                  className={`!mt-6 !h-11 !w-full rounded-lg ${
                    isCurrent
                      ? "!bg-slate-200 !text-slate-500"
                      : "!bg-slate-950 !text-white hover:!bg-slate-800"
                  }`}
                >
                  {busyPlan === plan.key ? <Loader2 className="!h-4 !w-4 animate-spin" /> : <CreditCard className="!h-4 !w-4" />}
                  {isCurrent ? "Current plan" : isPaid ? "Upgrade with Stripe" : "Included"}
                </Button>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white !p-6 shadow-sm">
          <div className="flex items-center !gap-3">
            <div className="flex !h-11 !w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Sparkles className="!h-5 !w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-950">Usage this period</h3>
              <p className="text-sm text-slate-500">
                {formatDate(status?.user?.billingPeriodStart)} to {formatDate(status?.user?.billingPeriodEnd)}
              </p>
            </div>
          </div>

          <div className="!mt-6 !space-y-5">
            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Question generations</span>
                <span className="text-slate-500">
                  {usedCredits}/{currentPlan.monthlyInterviewCredits}
                </span>
              </div>
              <div className="!mt-2 !h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="!h-full rounded-full bg-slate-950" style={{ width: `${creditPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Voice minutes</span>
                <span className="text-slate-500">
                  {usedVoice}/{currentPlan.monthlyVoiceMinutes}
                </span>
              </div>
              <div className="!mt-2 !h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="!h-full rounded-full bg-cyan-500" style={{ width: `${voicePercent}%` }} />
              </div>
            </div>

            <div className="grid !gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 !p-4">
                <p className="text-xs text-slate-500">Created</p>
                <p className="!mt-1 text-xl font-bold text-slate-950">{status?.usage?.interviewsCreated || 0}</p>
              </div>
              <div className="rounded-xl bg-slate-50 !p-4">
                <p className="text-xs text-slate-500">AI calls</p>
                <p className="!mt-1 text-xl font-bold text-slate-950">{usedCredits}</p>
              </div>
              <div className="rounded-xl bg-slate-50 !p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="!mt-1 text-sm font-bold capitalize text-slate-950">
                  {status?.user?.subscriptionStatus || "free"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BillingPage;
