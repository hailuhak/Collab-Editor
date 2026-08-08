
"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import GoogleSignInButton from "@/components/GoogleSignInButton";


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

            confirmPassword: form.get("confirmPassword") as string,

        };

        if (data.password !== data.confirmPassword) {

            setError("Passwords do not match");

            setLoading(false);

            return;

        }


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
                                minLength={8}
                                maxLength={64}
                                required
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
                            />

                        </div>



                        {/* Confirm Password */}

                        <div>

                            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">

                                Confirm Password

                            </label>


                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                minLength={8}
                                maxLength={64}
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



                    <GoogleSignInButton />

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
