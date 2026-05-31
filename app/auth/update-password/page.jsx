'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/services/supabaseClient';

function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setHasSession(Boolean(data?.session));
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasSession(true);
        setCheckingSession(false);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Password updated successfully.');
    router.replace('/dashboard');
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
          <KeyRound className="!h-5 !w-5" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Create a new password</h1>
        <p className="!mt-3 text-sm leading-6 text-slate-500">
          Choose a strong password to secure your IntelliHire workspace.
        </p>

        {checkingSession ? (
          <div className="!mt-8 flex items-center !gap-3 rounded-xl bg-slate-50 !p-5 text-sm text-slate-600">
            <Loader2 className="!h-4 !w-4 animate-spin" />
            Verifying your reset link...
          </div>
        ) : hasSession ? (
          <form onSubmit={handleUpdatePassword} className="!mt-8 !space-y-4">
            <div>
              <label htmlFor="new-password" className="!mb-2 block text-sm font-medium text-slate-700">
                New password
              </label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                className="!h-12 rounded-lg border-slate-300 !px-4"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="!mb-2 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter new password"
                className="!h-12 rounded-lg border-slate-300 !px-4"
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="!h-12 !w-full rounded-lg !bg-slate-950 !text-white hover:!bg-slate-800"
            >
              {loading ? <Loader2 className="!h-4 !w-4 animate-spin" /> : <CheckCircle2 className="!h-4 !w-4" />}
              Update password
            </Button>
          </form>
        ) : (
          <div className="!mt-8 rounded-xl border border-amber-200 bg-amber-50 !p-5 text-sm leading-6 text-amber-900">
            This reset link is missing or expired. Request a new password reset email and open the latest link.
          </div>
        )}
      </div>
    </main>
  );
}

export default UpdatePasswordPage;
