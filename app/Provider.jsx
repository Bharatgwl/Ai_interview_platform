"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { InterviewDataProvider } from '@/context/InterviewDataContext';
import { supabase } from '@/services/supabaseClient'
import React, { useContext, useEffect, useState } from 'react'

function Provider({ children } = {}) {

    const [user, setUser] = useState();
    useEffect(() => {
        console.log("Provider mounted");
        // Check if user exists in the database
        CreateNewUser();


    }, [])
    const CreateNewUser = () => {
        supabase.auth.getSession().then(async ({ data }) => {
            const token = data?.session?.access_token;
            if (!token) return;

            try {
                const response = await fetch('/api/users/sync', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const payload = await response.json();
                if (!response.ok) {
                    console.error("User sync failed:", payload?.error);
                    return;
                }

                setUser(payload.user);
            } catch (error) {
                console.error("User sync failed:", error);
            }
        })
    }

    return (
        <UserDetailContext.Provider value={{ user, setUser }}>

            <InterviewDataProvider>
                {children}
            </InterviewDataProvider>

        </UserDetailContext.Provider>

    )
}

export default Provider

export const useUser = () => {
    const context = useContext(UserDetailContext);
    return context;
}
