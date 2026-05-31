"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Activity, BarChart3, Clock, CreditCard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/Provider";

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) return;

        const { data } = await axios.get("/api/billing/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBilling(data);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Could not load usage stats.");
      } finally {
        setLoading(false);
      }
    };

    loadBilling();
  }, []);

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const stats = [
    {
      label: "Plan",
      value: loading ? "Loading..." : billing?.plan?.name || "Free",
      icon: CreditCard,
    },
    {
      label: "Credits left",
      value: loading ? "-" : billing?.user?.credits ?? 0,
      icon: BarChart3,
    },
    {
      label: "Voice minutes left",
      value: loading ? "-" : billing?.user?.voiceMinutesRemaining ?? 0,
      icon: Clock,
    },
  ];

  return (
    <div className="!space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Workspace</p>
        <h2 className="text-3xl font-bold text-slate-950">Settings</h2>
        <p className="!mt-2 text-sm text-slate-500">
          Manage your profile, active Supabase session, subscription state, and usage tracking.
        </p>
      </div>

      <div className="grid !gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl border border-slate-200 bg-white !p-6 shadow-sm">
          <div className="flex items-center !gap-4">
            {user?.picture ? (
              <Image src={user.picture} alt="Profile" width={72} height={72} className="!h-[72px] !w-[72px] rounded-full object-cover" />
            ) : (
              <div className="flex !h-[72px] !w-[72px] items-center justify-center rounded-full bg-slate-950 text-white">
                <UserRound className="!h-8 !w-8" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-950">{user?.name || "Recruiter"}</h3>
              <p className="!mt-1 text-sm text-slate-500">{user?.email || "Signed in user"}</p>
              <span className="!mt-3 inline-flex items-center !gap-2 rounded-full bg-emerald-50 !px-3 !py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="!h-3.5 !w-3.5" />
                Supabase authenticated
              </span>
            </div>
          </div>

          <div className="!mt-8 rounded-xl border border-slate-200 bg-slate-50 !p-4">
            <h4 className="font-semibold text-slate-950">Billing period</h4>
            <p className="!mt-2 text-sm text-slate-500">
              {formatDate(billing?.user?.billingPeriodStart)} to {formatDate(billing?.user?.billingPeriodEnd)}
            </p>
            <p className="!mt-1 text-sm capitalize text-slate-700">
              Subscription status: {billing?.user?.subscriptionStatus || "free"}
            </p>
          </div>

          <Button variant="outline" onClick={onLogout} className="!mt-6 !h-11 !w-full rounded-lg border-red-200 !text-red-700 hover:!bg-red-50 hover:!text-red-700">
            <LogOut className="!h-4 !w-4" />
            Logout
          </Button>
        </section>

        <section className="!space-y-5">
          <div className="grid !gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white !p-5 shadow-sm">
                <div className="flex !h-10 !w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <stat.icon className="!h-5 !w-5" />
                </div>
                <p className="!mt-4 text-sm text-slate-500">{stat.label}</p>
                <p className="!mt-1 text-2xl font-bold text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white !p-6 shadow-sm">
            <div className="flex items-center justify-between !gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Recent usage ledger</h3>
                <p className="!mt-1 text-sm text-slate-500">Server-recorded billing events for this billing period.</p>
              </div>
              <Activity className="!h-6 !w-6 text-slate-500" />
            </div>

            <div className="!mt-5 !space-y-3">
              {(billing?.recentUsage || []).length === 0 && (
                <div className="rounded-xl bg-slate-50 !p-5 text-sm text-slate-500">
                  No usage has been recorded in this billing period yet.
                </div>
              )}

              {(billing?.recentUsage || []).map((item) => (
                <div key={`${item.event_type}-${item.created_at}`} className="flex items-center justify-between !gap-4 rounded-xl border border-slate-100 !p-4">
                  <div>
                    <p className="text-sm font-semibold capitalize text-slate-950">
                      {String(item.event_type || "").replaceAll("_", " ")}
                    </p>
                    <p className="!mt-1 text-xs text-slate-500">{formatDate(item.created_at)}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 !px-3 !py-1 text-sm font-semibold text-slate-700">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
