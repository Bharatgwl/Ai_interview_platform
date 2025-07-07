import { Video, Phone } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

function CreateOption() {
    return (
        <div className='grid grid-cols-2 gap-6'>
            <Link href={'/dashboard/create-interview'} className='border rounded-2xl bg-quaternary border-gray-200 !p-5 cursor-pointer  '>
                <Video className='!p-3 text-primary bg-blue-100 rounded-lg h-12 w-12' />
                <h2 className='!mt-3 font-bold '>
                    Create New Interview
                </h2>
                <p className='text-gray-500'>Create AI Interview and Schedule then with Candidate</p>
            </Link >
            <div className='border rounded-2xl bg-quaternary border-gray-200 !p-5'>
                <Phone className='!p-3 text-primary bg-blue-100 rounded-lg h-12 w-12' />
                <h2 className='!mt-3 font-bold '>
                    Create Phone Screening
                </h2>
                <p className='text-gray-500'>Schedule Phone Screening With Candidates</p>
            </div>
        </div>
    )
}

export default CreateOption
