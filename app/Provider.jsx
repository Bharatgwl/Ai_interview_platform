"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { InterviewDataProvider } from '@/context/InterviewDataContext';
import { supabase } from '@/services/supabaseClient'
import { ClockFading } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'

function Provider({ children } = {}) {

    const [user, setUser] = useState();
    useEffect(() => {
        console.log("Provider mounted");
        // Check if user exists in the database
        CreateNewUser();


    }, [])
    const CreateNewUser = () => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {

            // Check if user exists

            let { data: Users, error } = await supabase
                .from('Users')
                .select("*")
                .eq('email', user?.email);

            console.log(Users)

            if (Users?.length == 0) {
                // If user does not exist, create a new user

                const { data, error } = await supabase
                    .from("Users")
                    .insert([
                        {
                            name: user?.user_metadata?.name,
                            email: user?.email,
                            picture: user?.user_metadata?.picture,
                        }

                    ])
                console.log(data);
                if (error) {
                    console.error("Insert failed:", error.message);
                } else {
                    console.log("User inserted:", data);
                }
                setUser[data];
                return;


            }
            setUser(Users[0]);
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
