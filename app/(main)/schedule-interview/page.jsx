"use client"
import React from 'react'
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/Provider'
import { useEffect, useState } from 'react'
const ScheduledInterview = () => {
  const { user } = useUser()
  const [interviewList, setInterviewList] = useState([])
  useEffect(() => {
    user && GetInterviewList()
  }, [user])
  const GetInterviewList = async () => {
    const { data, error } = await supabase
      .from('Interviews')
      .select("jobPosition", "duration", "interview_id", "interview-feedback(userEmail)")
      .eq('userEmail', user?.email)
      .order('id', { ascending: false })

    if (error) {
      console.error("Error fetching interviews:", error)
    } else {
      console.log("Interviews:", data)
    }
    setInterviewList(data)
  }
  return (
    <div>ScheduledInterview</div>
  )
}

export default ScheduledInterview