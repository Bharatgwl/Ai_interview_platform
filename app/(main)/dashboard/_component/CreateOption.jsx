import { ArrowRight, Phone, Video } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

function CreateOption() {
    const options = [
        {
            title: 'Create AI Interview',
            desc: 'Generate tailored questions and share a candidate interview link.',
            icon: Video,
            href: '/dashboard/create-interview',
        },
        {
            title: 'Phone Screening',
            desc: 'Prepare a lightweight screening flow for initial candidate calls.',
            icon: Phone,
            href: '/schedule-interview',
        },
    ];

    return (
        <section>
            <div className="!mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-950">Start a workflow</h2>
                    <p className="text-sm text-slate-500">Choose how you want to screen candidates.</p>
                </div>
            </div>

            <div className="grid !gap-4 md:grid-cols-2">
                {options.map((option) => (
                    <Link
                        key={option.title}
                        href={option.href}
                        className="group rounded-xl border border-slate-200 bg-white !p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between !gap-4">
                            <div className="flex !h-12 !w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                                <option.icon className="!h-5 !w-5" />
                            </div>
                            <ArrowRight className="!h-5 !w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-950" />
                        </div>
                        <h3 className="!mt-5 text-lg font-bold text-slate-950">{option.title}</h3>
                        <p className="!mt-2 text-sm leading-6 text-slate-500">{option.desc}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default CreateOption;
