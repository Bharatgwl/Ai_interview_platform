import React from 'react'
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
} from "@/components/ui/alert-dialog"

function AlertConfirmation({ children, stopInterview }) {
    return (
        <div className="w-full ">
            <AlertDialog className="">
                <AlertDialogTrigger asChild>
                    <button className="text-sm font-medium text-red-600 hover:underline">
                        {children}
                    </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="max-w-md rounded-2xl shadow-lg bg-white dark:bg-zinc-900 !m-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold text-red-600">
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-300">
                            This action cannot be undone. Your interview will end.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex justify-end gap-2">
                        <AlertDialogCancel className="!px-4 !py-2 !m-1   rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={()=>stopInterview()}
                            className="!px-4 !py-2 !m-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer"
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AlertConfirmation
