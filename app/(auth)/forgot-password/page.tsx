"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      setLoading(true);
      setMessage("");

      // We will connect the server action here next.

      setMessage(
         "If an account exists with this email, a reset link will be sent."
      );

      setLoading(false);
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-6 dark:bg-[#0A0E1A]">
         <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
               <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[11px] font-bold text-white shadow-sm">
                  CF
               </div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Forgot password?
               </h1>
               <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Enter your email and we&apos;ll send you a password reset
                  link.
               </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
               <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                     <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Email
                     </label>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                        required
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {loading ? "Sending..." : "Send reset link"}
                  </button>

                  {message && (
                     <p className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-600 dark:bg-green-950/40 dark:text-green-400">
                        {message}
                     </p>
                  )}
               </form>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
               Remembered your password?{" "}
               <Link
                  href="/login"
                  className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
               >
                  Sign in
               </Link>
            </p>
         </div>
      </div>
   );
}