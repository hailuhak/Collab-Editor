import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/auth";
import SignOutButton from "@/components/SignOutButton"; // Client component for NextAuth signOut

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Layout level protection
  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Shared Header Navigation */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          
          {/* Logo / Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="rounded-lg bg-black p-1.5 text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            DocsApp
          </Link>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-8 w-8 rounded-full border"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 font-semibold text-xs text-gray-700">
                  {session.user.name ? session.user.name[0].toUpperCase() : "U"}
                </div>
              )}
              <span className="hidden text-sm font-medium text-gray-700 sm:inline-block">
                {session.user.name || session.user.email}
              </span>
            </div>

            {/* Client Sign Out Component */}
            <SignOutButton />
          </div>

        </div>
      </header>

      {/* Main Page Content */}
      {children}
    </div>
  );
}