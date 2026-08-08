"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, FileText, Users, Save, Check } from "lucide-react";

import { updateProfileName } from "@/app/actions/auth";

type ProfileClientProps = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: string;
    documentCount: number;
    sharedCount: number;
  };
};

export default function ProfileClient({ user }: ProfileClientProps) {
  const [name, setName] = useState(user.name ?? "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = () => {
    setMessage("");
    startTransition(async () => {
      const result = await updateProfileName(name);
      if (result?.error) {
        setMessage(result.error);
      } else {
        setMessage("saved");
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Profile settings
      </h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {/* Avatar */}
        <div className="mb-6 flex items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              {initials}
            </div>
          )}
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {user.name || "User"}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Stat icon={<FileText className="h-4 w-4" />} label="Owned documents" value={user.documentCount} />
          <Stat icon={<Users className="h-4 w-4" />} label="Shared with me" value={user.sharedCount} />
          <Stat
            icon={<Calendar className="h-4 w-4" />}
            label="Member since"
            value={new Date(user.createdAt).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          />
        </div>

        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !name.trim()}
              className="flex items-center gap-1.5 rounded-md bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1765cc] disabled:opacity-50"
            >
              {message === "saved" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {message === "saved" ? "Saved" : "Save"}
            </button>
          </div>
          {message && message !== "saved" && (
            <p className="mt-1.5 text-xs text-red-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-1 flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );
}
