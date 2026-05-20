'use client';

import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
// import Provider from './../Provider';
// Optional: use an icon for better UX

function Page() {
  const signInWithProvider = async (Provider_name) => {
    const { error } = await supabase.auth.signInWithOAuth({
      // use multiple providers
      provider: Provider_name,

      options: {
        redirectTo: `${window.location.origin}/dashboard`, // Redirect to dashboard after sign-in
      },
    });
    if (error) {
      console.error('Error signing in with Google:', error.message);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 ">
      <div className="flex flex-col items-center border rounded-2xl p-10 shadow-lg w-[90%] max-w-md bg-white">
        <Image
          src="/logo.png"
          alt="logo"
          width={400}
          height={100}
          className="w-[200px] !p-2 "
        />

        <Image
          src="/login.png"
          alt="login"
          width={600}
          height={400}
          className="w-[350px] h-[220px] object-cover rounded-md mb-6"
        />

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome to Recruiter Agent
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Sign in with Google to continue
        </p>

        {/* <Button className="w-1/2 gap-2 py-4 text-base font-medium !m-8"
          onClick={() => signInWithGoogle('google')}>
          <LogIn className="w-5 h-5" />
          Login with Google
        </Button>
        <Button className="w-1/2 gap py-4 text-base font-medium !m-8"
          onClick={() => signInWithGoogle('github')}>
          <LogIn className="w-5 h-5" />
          Login with Github
        </Button> */}
        <div className="flex flex-col w-full items-center !space-y-4 !pb-2">
          <Button
            className="w-1/2 gap-2 !py-4 text-base font-medium cursor-pointer"
            onClick={() => signInWithProvider('google')}
          >
            <LogIn className="!w-5 !h-5" />
            Login with Google
          </Button>

          <Button
            className="w-1/2 gap-2 !py-4 text-base font-medium cursor-pointer "
            onClick={() => signInWithProvider('github')}
          >
            <LogIn className="!w-5 !h-5" />
            Login with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
