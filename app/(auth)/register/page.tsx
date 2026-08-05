
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/actions/auth";


export default function RegisterPage() {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);


        const form = new FormData(e.currentTarget);


        const data = {

            name: form.get("name") as string,

            email: form.get("email") as string,

            password: form.get("password") as string,

        };


        try {

            const result = await registerUser(data);


            if (result.error) {

                setError(result.error);

            }
            else if (result.success) {

                setSuccess("Account created successfully");

            }

        }
        catch (err) {

            console.error(err);

            setError(
                "Something went wrong. Please try again."
            );

        }
        finally {

            setLoading(false);

        }

    }


    async function handleGoogleSignIn() {

        try {

            await signIn("google", {
                callbackUrl: "/dashboard",
            });

        }
        catch (error) {

            console.error(error);

            setError(
                "Google sign-in failed. Please try again."
            );

        }

    }


    return (

        <div className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-6 dark:bg-[#0A0E1A]">

            <div className="w-full max-w-sm">


                {/* Header */}

                <div className="mb-8 text-center">

                    <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[11px] font-bold text-white shadow-sm">

                        CF

                    </div>


                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">

                        Create your account

                    </h1>


                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">

                        Start collaborating in real time, for free.

                    </p>

                </div>



                {/* Card */}

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">


                    {/* Registration Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-3.5"
                    >


                        {/* Name */}

                        <div>

                            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">

                                Name

                            </label>


                            <input
                                name="name"
                                type="text"
                                placeholder="Jane Doe"
                                required
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />

                        </div>



                        {/* Email */}

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



                        {/* Password */}

                        <div>

                            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">

                                Password

                            </label>


                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />

                        </div>



                        {/* Create Account */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading
                                ? "Creating account..."
                                : "Create account"
                            }

                        </button>



                        {/* Error */}

                        {error && (

                            <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">

                                {error}

                            </p>

                        )}



                        {/* Success */}

                        {success && (

                            <p className="rounded-md bg-green-50 px-3 py-2 text-xs text-green-600 dark:bg-green-950/40 dark:text-green-400">

                                {success}

                            </p>

                        )}

                    </form>



                    {/* Divider */}

                    <div className="my-5 flex items-center gap-3">

                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">

                            Or continue with

                        </span>

                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                    </div>



                    {/* Google Sign In */}

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >

                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >

                            <path
                                fill="#4285F4"
                                d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.89c2.28-2.1 3.56-5.19 3.56-8.82Z"
                            />

                            <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.02c-1.08.72-2.46 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09A12 12 0 0 0 12 24Z"
                            />

                            <path
                                fill="#FBBC05"
                                d="M5.31 14.31A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.38-2.31V6.6H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.4l4.01-3.09Z"
                            />

                            <path
                                fill="#EA4335"
                                d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.3 6.6l4.01 3.09C6.25 6.87 8.89 4.77 12 4.77Z"
                            />

                        </svg>


                        Continue with Google

                    </button>

                </div>



                {/* Login Link */}

                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">

                    Already have an account?{" "}

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
