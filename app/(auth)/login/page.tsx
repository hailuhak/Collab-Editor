"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { PasswordInput } from "@/components/password-input";

export default function LoginPage() {
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setError("");
      setLoading(true);

      const form = new FormData(e.currentTarget);

      try {
         const result = await signIn("credentials", {
            email: form.get("email"),
            password: form.get("password"),
            redirect: false,
         });

         if (result?.error) {
            setError(
               result.error.includes("Too many attempts")
                  ? result.error
                  : "Invalid email or password"
            );
         } else {
            window.location.href = "/dashboard";
         }
      } catch {
         setError("An unexpected error occurred. Please try again.");
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-6 dark:bg-[#0A0E1A]">
         <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
               <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[11px] font-bold text-white shadow-sm">
                  CF
               </div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Welcome back
               </h1>
               <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Sign in to continue to your workspace.
               </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
               <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                     <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Email
                     </label>
                     <input
                        name="email"
                        type="email"
                        placeholder="jane@company.com"
                        required
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
                     />
                  </div>

                  <div>
                     <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                        Password
                     </label>
                     <PasswordInput
                        name="password"
                        placeholder="••••••••"
                        required
                     />
                     <div className="mt-1.5 text-right">
                        <Link
                           href="/forgot-password"
                           className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                        >
                           Forgot password?
                        </Link>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {loading ? "Signing in..." : "Sign in"}
                  </button>

                  {error && (
                     <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        {error}
                     </p>
                  )}
               </form>

               <GoogleSignInButton />
            </div>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
               Don&apos;t have an account?{" "}
               <Link
                  href="/register"
                  className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
               >
                  Sign up
               </Link>
            </p>
         </div>
      </div>
   );
}