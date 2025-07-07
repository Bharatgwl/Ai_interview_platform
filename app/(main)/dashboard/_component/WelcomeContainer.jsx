"use client";
import React from 'react'
import { useUser } from '@/app/Provider'
import Image from 'next/image';

function WelcomeContainer() {
    const { user } = useUser();

    return (
        <div className='bg-gray-200 !p-5 rounded-xl flex flex-col sm:flex-row sm:justify-between items-center gap-4 '>
            <div className='text-center sm:text-left'>
                <h2 className='text-lg font-bold'>Welcome Back, {user?.name || user?.email || "User"}</h2>
                <h2 className='text-gray-500'>AI-Driven Interview, Hassle-Free Hiring</h2>
            </div>

            {user?.picture && (
                <div className="!w-16 ! h-16 relative">
                    <Image
                        src={user.picture}
                        alt="Avatar"
                        width={54}
                        height={54}
                        className="rounded-full object-cover"
                        
                    />
                </div>
            )}
        </div>
    );
}

export default WelcomeContainer;
