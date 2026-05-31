'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, Loader2, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

function Page() {
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(null);

  const signInWithProvider = async (provider) => {
    setLoading(true);
    setProviderLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setLoading(false);
      setProviderLoading(null);
      toast.error(error.message);
    }
  };

  return (
    <main className="!min-h-screen bg-slate-950 text-white">
      <div className="grid !min-h-screen lg:grid-cols-[1fr_0.92fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            src="/login.png"
            alt="AI interview workspace"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/50" />
          <div className="absolute bottom-10 left-10 !max-w-xl">
            <div className="!mb-5 inline-flex items-center !gap-2 rounded-full bg-white/10 !px-4 !py-2 text-sm text-white backdrop-blur">
              <Sparkles className="!h-4 !w-4 text-cyan-200" />
              AI-powered screening workspace
            </div>
            <h1 className="text-5xl font-bold leading-tight">Run polished interviews without the scheduling drag.</h1>
            <p className="!mt-5 text-base leading-7 text-slate-200">
              Generate structured questions, share secure interview links, and capture candidate feedback in one recruiter-ready dashboard.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center !px-5 !py-10">
          <div className="!w-full !max-w-md rounded-2xl border border-white/10 bg-white !p-8 text-slate-950 shadow-2xl">
            <Link href="/" className="!mb-8 inline-flex items-center !gap-2 text-sm font-medium text-slate-500 hover:text-slate-950">
              <ArrowLeft className="!h-4 !w-4" />
              Back to home
            </Link>

            <Image
              src="/logo.png"
              alt="IntelliHire logo"
              width={190}
              height={80}
              className="!mb-8 !w-[160px] object-contain"
              priority
            />

            <h2 className="text-3xl font-bold tracking-tight">Sign in to IntelliHire</h2>
            <p className="!mt-3 text-sm leading-6 text-slate-500">
              Use Google or GitHub to access interviews, candidate links, billing, and hiring feedback.
            </p>

            <Button
              className="!mt-8 !h-12 !w-full rounded-lg !bg-slate-950 !text-white hover:!bg-slate-800"
              onClick={() => signInWithProvider('google')}
              disabled={loading}
            >
              {providerLoading === 'google' ? <Loader2 className="!h-4 !w-4 animate-spin" /> : <LogIn className="!h-4 !w-4" />}
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="!mt-3 !h-12 !w-full rounded-lg border-slate-300 !bg-white !text-slate-950 hover:!bg-slate-950 hover:!text-white"
              onClick={() => signInWithProvider('github')}
              disabled={loading}
            >
              {providerLoading === 'github' ? <Loader2 className="!h-4 !w-4 animate-spin" /> : <Github className="!h-4 !w-4" />}
              Continue with GitHub
            </Button>

            <div className="!mt-4 text-center">
              <Link href="/auth/forgot-password" className="text-sm font-medium text-slate-500 hover:text-slate-950">
                Forgot your password?
              </Link>
            </div>

            <div className="!mt-6 flex items-start !gap-3 rounded-lg bg-slate-50 !p-4 text-sm text-slate-600">
              <ShieldCheck className="!mt-0.5 !h-4 !w-4 text-emerald-600" />
              <p>Authentication is handled through Supabase OAuth and your configured Google and GitHub OAuth clients.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Page;
