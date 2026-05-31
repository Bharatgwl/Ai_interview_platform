'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { ArrowLeft, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/services/supabaseClient';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error('Enter your email address.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSent(true);
    toast.success('Password reset link sent.');
  };

  return (
    <main className="flex !min-h-screen items-center justify-center bg-slate-950 !px-5 !py-10 text-white">
      <div className="!w-full !max-w-md rounded-2xl border border-white/10 bg-white !p-8 text-slate-950 shadow-2xl">
        <Link href="/auth" className="!mb-8 inline-flex items-center !gap-2 text-sm font-medium text-slate-500 hover:text-slate-950">
          <ArrowLeft className="!h-4 !w-4" />
          Back to login
        </Link>

        <Image
          src="/logo.png"
          alt="IntelliHire logo"
          width={190}
          height={80}
          className="!mb-8 !w-[160px] object-contain"
          priority
        />

        <div className="!mb-5 flex !h-12 !w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Mail className="!h-5 !w-5" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="!mt-3 text-sm leading-6 text-slate-500">
          Enter your account email and IntelliHire will send a secure password reset link.
        </p>

        {sent ? (
          <div className="!mt-8 rounded-xl border border-emerald-200 bg-emerald-50 !p-5 text-sm leading-6 text-emerald-900">
            Check your inbox for the reset link. Open it on this device, then set a new password from the secure reset page.
          </div>
        ) : (
          <form onSubmit={handleReset} className="!mt-8 !space-y-4">
            <div>
              <label htmlFor="reset-email" className="!mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="!h-12 rounded-lg border-slate-300 !px-4"
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="!h-12 !w-full rounded-lg !bg-slate-950 !text-white hover:!bg-slate-800"
            >
              {loading ? <Loader2 className="!h-4 !w-4 animate-spin" /> : <Mail className="!h-4 !w-4" />}
              Send reset link
            </Button>
          </form>
        )}

        <div className="!mt-6 flex items-start !gap-3 rounded-lg bg-slate-50 !p-4 text-sm text-slate-600">
          <ShieldCheck className="!mt-0.5 !h-4 !w-4 text-emerald-600" />
          <p>This works for email and password accounts. Google and GitHub users should sign in with their provider.</p>
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
