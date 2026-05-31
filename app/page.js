"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  CreditCard,
  FileText,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { label: "Interview credits", value: "100", detail: "Pro monthly" },
  { label: "Voice minutes", value: "500", detail: "Tracked live" },
  { label: "Setup time", value: "2m", detail: "Role to link" },
];

const workflow = [
  {
    icon: FileText,
    title: "Describe the role",
    text: "Add the position, experience level, duration, and interview style.",
  },
  {
    icon: Sparkles,
    title: "Generate the question set",
    text: "AI creates a balanced technical, behavioral, and problem-solving flow.",
  },
  {
    icon: Mic,
    title: "Run the voice interview",
    text: "Candidates join a clean interview room with minute tracking and feedback.",
  },
];

const plans = [
  { name: "Free", price: "0", credits: "3 credits", minutes: "15 voice minutes" },
  { name: "Starter", price: "499", credits: "25 interviews", minutes: "100 voice minutes" },
  { name: "Pro", price: "1499", credits: "100 interviews", minutes: "500 voice minutes" },
];

const activity = [
  "Full Stack Developer interview generated",
  "Candidate link copied",
  "Voice minutes checked",
  "Feedback report saved",
];

function VoiceBars() {
  return (
    <div className="flex items-end !gap-1" aria-hidden="true">
      {[18, 34, 48, 28, 56, 40, 24, 50, 32].map((height, index) => (
        <span
          key={index}
          className="voice-bar !w-1.5 rounded-full bg-cyan-300"
          style={{ height, animationDelay: `${index * 90}ms` }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="!mx-auto flex !h-[72px] !max-w-7xl items-center justify-between !px-4 sm:!px-6 lg:!px-8">
          <button onClick={() => router.push("/")} className="flex items-center !gap-3" aria-label="IntelliHire home">
            <Image src="/logo.png" alt="IntelliHire" width={150} height={52} className="!h-10 !w-auto rounded bg-white !px-2 !py-1" />
          </button>

          <nav className="hidden items-center !gap-8 text-sm text-slate-300 md:flex">
            <a href="#workflow" className="transition hover:text-white">Workflow</a>
            <a href="#plans" className="transition hover:text-white">Plans</a>
            <a href="#security" className="transition hover:text-white">Security</a>
          </nav>

          <div className="flex items-center !gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push("/auth")}
              className="hidden !h-10 rounded-lg !px-4 !text-white hover:!bg-white/10 sm:inline-flex"
            >
              Sign in
            </Button>
            <Button
              onClick={() => router.push("/auth")}
              className="group !h-10 rounded-lg !bg-white !px-4 !text-slate-950 hover:!bg-cyan-100"
            >
              Start free
              <ArrowRight className="!h-4 !w-4 transition group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[92vh] bg-slate-950 !pt-24 text-white">
        <div className="absolute inset-0 opacity-[0.18] hero-grid" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 !h-36 bg-gradient-to-t from-[#f7f9fc] to-transparent" aria-hidden="true" />

        <div className="relative !mx-auto grid !max-w-7xl items-center !gap-10 !px-4 !pb-12 !pt-8 sm:!px-6 lg:grid-cols-[0.95fr_1.05fr] lg:!px-8 lg:!pt-14">
          <div className="!max-w-3xl">
            <div className="inline-flex items-center !gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 !px-3 !py-2 text-sm font-medium text-cyan-100">
              <Sparkles className="!h-4 !w-4" />
              AI interviews with billing-aware usage controls
            </div>

            <h1 className="!mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              IntelliHire
            </h1>
            <p className="!mt-5 max-w-2xl text-2xl font-semibold leading-9 text-slate-100">
              Create, share, and review AI interviews from one polished workspace.
            </p>
            <p className="!mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Generate structured question sets, launch voice interviews, track credits and minutes, then review candidate feedback without stitching tools together.
            </p>

            <div className="!mt-8 flex flex-col !gap-3 sm:flex-row">
              <Button
                onClick={() => router.push("/auth")}
                className="group !h-[52px] rounded-lg !bg-cyan-300 !px-6 !text-slate-950 hover:!bg-white"
              >
                Get started
                <ArrowRight className="!h-4 !w-4 transition group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })}
                className="!h-[52px] rounded-lg border-white/20 !bg-white/5 !px-6 !text-white hover:!bg-white hover:!text-slate-950"
              >
                <Play className="!h-4 !w-4" />
                See workflow
              </Button>
            </div>

            <div className="!mt-10 grid !gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-white/10 bg-white/10 !p-4 backdrop-blur">
                  <p className="text-3xl font-black text-white">{metric.value}</p>
                  <p className="!mt-1 text-sm font-medium text-slate-200">{metric.label}</p>
                  <p className="!mt-1 text-xs text-slate-400">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative !min-h-[520px]">
            <div className="absolute right-0 top-0 !h-full !w-full max-w-2xl rounded-lg border border-white/10 bg-white/10 !p-3 shadow-2xl backdrop-blur-md">
              <div className="rounded-lg bg-slate-100 !p-4 text-slate-950">
                <div className="flex items-center justify-between !gap-3 border-b border-slate-200 !pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Live workspace</p>
                    <h2 className="!mt-1 text-xl font-black">Senior Product Engineer</h2>
                  </div>
                  <span className="rounded-lg bg-emerald-50 !px-3 !py-2 text-xs font-bold text-emerald-700">Active</span>
                </div>

                <div className="grid !gap-3 !py-4 sm:grid-cols-3">
                  {[
                    ["Credits", "99/100"],
                    ["Voice", "492 min"],
                    ["Duration", "30 min"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-white !p-3 shadow-sm">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="!mt-1 text-lg font-black">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid !gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-lg bg-slate-950 !p-4 text-white">
                    <div className="flex items-center !gap-3">
                      <Image src="/Ai.ico" alt="AI recruiter" width={42} height={42} className="!h-11 !w-11 rounded-lg bg-white !p-1" />
                      <div>
                        <p className="font-bold">AI Recruiter</p>
                        <p className="text-xs text-cyan-200">Speaking now</p>
                      </div>
                    </div>
                    <div className="!mt-7 flex items-center justify-center !py-5">
                      <VoiceBars />
                    </div>
                    <p className="rounded-lg bg-white/10 !p-3 text-sm leading-6 text-slate-200">
                      Walk me through a system you designed and the tradeoffs you made.
                    </p>
                  </div>

                  <div className="!space-y-3">
                    {activity.map((item, index) => (
                      <div key={item} className="activity-row flex items-center !gap-3 rounded-lg bg-white !p-3 shadow-sm" style={{ animationDelay: `${index * 180}ms` }}>
                        <span className="flex !h-8 !w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                          <Check className="!h-4 !w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-950">{item}</p>
                          <p className="text-xs text-slate-500">Synced to usage ledger</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 left-0 hidden !w-64 rounded-lg border border-white/10 bg-slate-900 !p-4 shadow-2xl md:block">
              <div className="flex items-center !gap-3">
                <Image src="/interview.png" alt="Interview illustration" width={72} height={72} className="!h-16 !w-16 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-bold text-white">Candidate ready</p>
                  <p className="!mt-1 text-xs leading-5 text-slate-400">Secure link, voice check, and feedback pipeline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-slate-200 bg-white !py-[72px]">
        <div className="!mx-auto !max-w-7xl !px-4 sm:!px-6 lg:!px-8">
          <div className="flex flex-col justify-between !gap-6 lg:flex-row lg:items-end">
            <div className="!max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Workflow</p>
              <h2 className="!mt-3 text-4xl font-black tracking-tight text-slate-950">From job brief to candidate insight.</h2>
            </div>
            <p className="!max-w-xl text-base leading-7 text-slate-600">
              The product flow is built for repeated hiring work: fast setup, clear sharing, controlled AI spend, and measurable usage.
            </p>
          </div>

          <div className="!mt-10 grid !gap-4 lg:grid-cols-3">
            {workflow.map((item, index) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 !p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-400">0{index + 1}</span>
                  <span className="flex !h-11 !w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <item.icon className="!h-5 !w-5" />
                  </span>
                </div>
                <h3 className="!mt-8 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="!mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="bg-[#f7f9fc] !py-[72px]">
        <div className="!mx-auto !max-w-7xl !px-4 sm:!px-6 lg:!px-8">
          <div className="grid !gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-700">Billing-aware SaaS</p>
              <h2 className="!mt-3 text-4xl font-black tracking-tight text-slate-950">Plans, credits, and voice minutes stay visible.</h2>
              <p className="!mt-5 text-base leading-8 text-slate-600">
                Stripe handles payment, Supabase stores plan state, and IntelliHire checks usage before expensive AI and voice calls.
              </p>
              <div className="!mt-6 flex flex-wrap !gap-3 text-sm font-semibold text-slate-700">
                <span className="rounded-lg bg-white !px-3 !py-2 shadow-sm"><CreditCard className="!mr-2 inline !h-4 !w-4" />Stripe checkout</span>
                <span className="rounded-lg bg-white !px-3 !py-2 shadow-sm"><ShieldCheck className="!mr-2 inline !h-4 !w-4" />RLS protected</span>
                <span className="rounded-lg bg-white !px-3 !py-2 shadow-sm"><BarChart3 className="!mr-2 inline !h-4 !w-4" />Usage ledger</span>
              </div>
            </div>

            <div className="grid !gap-4 sm:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className={`rounded-lg border bg-white !p-5 shadow-sm ${plan.name === "Pro" ? "border-slate-950" : "border-slate-200"}`}>
                  <p className="text-lg font-black text-slate-950">{plan.name}</p>
                  <p className="!mt-4 text-3xl font-black">Rs {plan.price}</p>
                  <p className="!mt-5 text-sm text-slate-600">{plan.credits}</p>
                  <p className="!mt-2 text-sm text-slate-600">{plan.minutes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="bg-slate-950 !py-[72px] text-white">
        <div className="!mx-auto grid !max-w-7xl !gap-8 !px-4 sm:!px-6 lg:grid-cols-[1fr_0.8fr] lg:!px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Production ready direction</p>
            <h2 className="!mt-3 text-4xl font-black tracking-tight">Secure by default where it matters.</h2>
            <p className="!mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Server-side Supabase writes, Stripe webhook verification, origin checks, rate limits, and plan enforcement protect the costly parts of the platform.
            </p>
          </div>
          <div className="grid !gap-3">
            {[
              ["Authenticated AI generation", Zap],
              ["Voice minute allowance check", Clock3],
              ["Candidate flow tracking", Users],
              ["Verified Stripe webhooks", ShieldCheck],
            ].map(([label, Icon]) => (
              <div key={label} className="flex items-center !gap-3 rounded-lg border border-white/10 bg-white/5 !p-4">
                <Icon className="!h-5 !w-5 text-cyan-200" />
                <span className="font-semibold text-slate-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white !px-4 !py-16 sm:!px-6 lg:!px-8">
        <div className="!mx-auto flex !max-w-7xl flex-col items-center justify-between !gap-6 rounded-lg border border-slate-200 bg-slate-50 !p-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-black text-slate-950">Ready to run smarter interviews?</h2>
            <p className="!mt-2 text-slate-600">Start free, then upgrade when your hiring volume grows.</p>
          </div>
          <Button onClick={() => router.push("/auth")} className="group !h-12 rounded-lg !bg-slate-950 !px-6 !text-white hover:!bg-cyan-700">
            Launch IntelliHire
            <ArrowRight className="!h-4 !w-4 transition group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white !py-8">
        <div className="!mx-auto flex !max-w-7xl flex-col items-center justify-between !gap-4 !px-4 text-sm text-slate-500 sm:!px-6 md:flex-row lg:!px-8">
          <p>IntelliHire, AI interview workspace.</p>
          <div className="flex items-center !gap-5">
            <a href="#workflow" className="hover:text-slate-950">Workflow</a>
            <a href="#plans" className="hover:text-slate-950">Plans</a>
            <a href="#security" className="hover:text-slate-950">Security</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
