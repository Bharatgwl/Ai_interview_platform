import React from 'react';
import { AlertTriangle, PhoneOff } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AlertConfirmation({ children, stopInterview }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent className="!max-w-md rounded-2xl border border-slate-200 bg-white !p-0 shadow-2xl">
                <div className="border-b border-slate-100 !p-6">
                    <div className="flex !h-12 !w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertTriangle className="!h-6 !w-6" />
                    </div>
                    <AlertDialogHeader className="!mt-5 text-left">
                        <AlertDialogTitle className="text-xl font-bold text-slate-950">
                            End this interview?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="!mt-2 text-sm leading-6 text-slate-500">
                            The call will disconnect and the app will generate feedback from the conversation captured so far.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                <AlertDialogFooter className="flex !gap-3 !p-4 sm:justify-end">
                    <AlertDialogCancel className="!m-0 rounded-lg border-slate-200 !px-4">
                        Keep going
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={stopInterview}
                        className="!m-0 rounded-lg bg-red-600 !px-4 text-white hover:bg-red-700"
                    >
                        <PhoneOff className="!h-4 !w-4" />
                        End interview
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default AlertConfirmation;
