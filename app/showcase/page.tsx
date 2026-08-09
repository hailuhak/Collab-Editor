"use client";

import {
  Plus,
  Search,
  Share2,
  Star,
  MoreVertical,
  FileText,
  Users,
  Clock,
  Mail,
  Send,
  Shield,
  Check,
  CheckCheck,
  Download,
  MessageSquare,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Bell,
  FolderOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 text-slate-900 dark:bg-[#0A0E1A] dark:text-slate-100">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0A0E1A]/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[12px] font-bold text-white shadow-sm">
              CF
            </div>
            <span className="text-sm font-semibold tracking-tight">
              CollabFlow
            </span>
            <span className="ml-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
              UI Showcase
            </span>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 md:flex">
              <span className="rounded-md px-3 py-1 text-slate-900 dark:text-slate-100">
                Components
              </span>
              <span className="rounded-md px-3 py-1 transition hover:text-slate-900 dark:hover:text-slate-100">
                Editor
              </span>
              <span className="rounded-md px-3 py-1 transition hover:text-slate-900 dark:hover:text-slate-100">
                Docs
              </span>
            </nav>
            <ThemeToggle />
            <button className="hidden rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:block">
              Sign in
            </button>
            <button className="rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-violet-600/20 transition hover:opacity-90">
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Hero */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 pt-14 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
          <Sparkles className="h-3 w-3" />
          Every component in one place
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          A complete UI,{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
            built for real-time docs
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Cards, buttons, badges, avatars, dialogs and a live editor — composed
          the way CollabFlow looks and feels.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition hover:opacity-90">
            <Plus className="h-4 w-4" />
            New document
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Component gallery */}
      {/* ------------------------------------------------------------------ */}
      <main className="mx-auto mt-12 grid max-w-6xl gap-6 px-4 md:grid-cols-2">
        {/* ================= Buttons ================= */}
        <Section title="Buttons" span>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition hover:opacity-90">
              Gradient
            </button>
            <button className="rounded-md bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1765cc]">
              Primary
            </button>
            <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
              Secondary
            </button>
            <button className="flex items-center gap-1.5 rounded-md bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1765cc]">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              <Star className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-pink-600 text-white shadow-sm transition hover:opacity-90">
              <Plus className="h-4 w-4" />
            </button>
            <button
              disabled
              className="cursor-not-allowed rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400 opacity-60 dark:border-slate-800"
            >
              Disabled
            </button>
          </div>
        </Section>

        {/* ================= Inputs ================= */}
        <Section title="Inputs & selects">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full rounded border border-slate-300 bg-white py-2 pl-8 pr-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
                />
              </div>
              <select className="rounded border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                <option>Viewer</option>
                <option>Commenter</option>
                <option>Editor</option>
              </select>
              <button className="rounded bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1765cc]">
                Send
              </button>
            </div>
            <textarea
              placeholder="Add a comment…"
              rows={2}
              className="w-full resize-none rounded border border-slate-300 bg-white p-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
            />
          </div>
        </Section>

        {/* ================= Badges & status ================= */}
        <Section title="Badges, roles & status">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              Editor
            </Badge>
            <Badge className="bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
              Commenter
            </Badge>
            <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Viewer
            </Badge>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400">
              <Check className="h-3 w-3" />
              Resolved
            </Badge>
            <Badge className="bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              2 open
            </Badge>
            <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              View only
            </Badge>
            <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Clock className="h-3 w-3" />
              2h ago
            </Badge>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              All changes saved
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Saving…
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              Offline
            </span>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
              Real-time sync
            </span>
          </div>
        </Section>

        {/* ================= Avatars ================= */}
        <Section title="Avatars & presence">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              <Avatar initials="AK" color="#4285F4" online />
              <Avatar initials="MJ" color="#EA4335" online />
              <Avatar initials="TS" color="#FBBC04" />
              <Avatar initials="RP" color="#34A853" online />
              <Avatar initials="+" color="#8E24AA" />
            </div>
            <span className="ml-3 text-xs text-slate-500 dark:text-slate-400">
              5 collaborators online
            </span>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <Avatar initials="AK" color="#4285F4" online />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Aisha Khan{" "}
                  <span className="text-[10px] font-normal text-slate-400">
                    (you)
                  </span>
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  aisha@example.com
                </p>
              </div>
              <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Shield className="h-3 w-3" />
                Owner
              </Badge>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              <Avatar initials="MJ" color="#EA4335" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Marcus Johnson
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  marcus@example.com
                </p>
              </div>
              <select className="rounded border border-slate-200 bg-white px-2 py-1 text-xs outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <option>Editor</option>
                <option>Commenter</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>
        </Section>

        {/* ================= Document cards ================= */}
        <Section title="Document cards" span>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <CardDoc color="#1a73e8" title="Q3 Roadmap" meta="2h ago" badge="Editor" />
            <CardDoc color="#34A853" title="Product Spec v2" meta="Yesterday" badge="Commenter" />
            <CardDoc color="#EA4335" title="Meeting Notes" meta="3d ago" />
            <CardDoc color="#8E24AA" title="Design Review" meta="1w ago" badge="Editor" />
            <CardDoc color="#FBBC04" title="Engineering Wiki" meta="Just now" />
            <CardDoc color="#00ACC1" title="Launch Checklist" meta="4h ago" badge="Viewer" />
            <button className="group flex aspect-[4/5] flex-col rounded-lg border border-dashed border-slate-300 transition hover:border-violet-400 dark:border-slate-700">
              <div className="flex flex-1 items-center justify-center rounded-t-lg bg-slate-50 transition group-hover:bg-violet-50 dark:bg-slate-800/50 dark:group-hover:bg-violet-950/40">
                <Plus className="h-10 w-10 text-slate-300 transition group-hover:text-violet-500 dark:text-slate-600" />
              </div>
              <div className="border-t border-slate-100 p-3 text-sm font-medium text-slate-600 dark:border-slate-800 dark:text-slate-400">
                Blank document
              </div>
            </button>
          </div>
        </Section>

        {/* ================= Editor mock ================= */}
        <Section title="Editor" span>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
              <ToolChip icon="B" title="Bold" active />
              <ToolChip icon="I" title="Italic" />
              <ToolChip icon="U" title="Underline" />
              <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <select className="h-7 rounded border border-transparent bg-transparent px-2 text-xs font-medium outline-none hover:bg-slate-100 dark:hover:bg-slate-800">
                <option>Heading 1</option>
                <option>Heading 2</option>
                <option>Normal text</option>
              </select>
              <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <ToolChip icon="•" title="Bulleted list" />
              <ToolChip icon="1." title="Numbered list" />
              <ToolChip icon="✓" title="Checklist" />
              <ToolChip icon="❝" title="Quote" />
              <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
              <ToolChip icon="🔗" title="Link" />
              <ToolChip icon="🗣" title="Highlight" />
              <ToolChip icon="⨯" title="Clear formatting" />
              <div className="ml-auto hidden items-center gap-2 sm:flex">
                <div className="flex -space-x-1.5">
                  <Avatar initials="AK" color="#4285F4" size={22} online />
                  <Avatar initials="MJ" color="#EA4335" size={22} online />
                  <Avatar initials="TS" color="#FBBC04" size={22} />
                </div>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Saving…
                </span>
              </div>
            </div>

            {/* document */}
            <div className="px-8 py-6 sm:px-12">
              <div className="mx-auto max-w-lg">
                <div className="mb-3 h-6 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="space-y-2.5">
                  <div className="h-2.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="relative h-2.5 w-11/12 rounded bg-slate-100 dark:bg-slate-800">
                    <span className="absolute -top-4 left-[38%] flex items-center gap-1 rounded bg-[#4285F4] px-1.5 py-0.5 text-[8px] font-medium text-white shadow">
                      <span className="h-1 w-1 rounded-full bg-white" /> Aisha
                    </span>
                  </div>
                  <div className="h-2.5 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-2.5 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="h-2.5 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                  <div className="flex items-center gap-2 pt-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-200 dark:bg-violet-900" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ================= Share dialog mock ================= */}
        <Section title="Share dialog">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Share document
              </h3>
              <span className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                ×
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Avatar initials="AK" color="#4285F4" size={28} online />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Aisha Khan
                  </p>
                  <p className="text-[10px] text-slate-400">aisha@example.com</p>
                </div>
                <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Owner
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Avatar initials="MJ" color="#EA4335" size={28} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Marcus Johnson
                  </p>
                  <p className="text-[10px] text-slate-400">marcus@example.com</p>
                </div>
                <select className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                  <option>Editor</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  placeholder="Enter email address"
                  className="flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button className="rounded bg-[#1a73e8] px-3 py-1.5 text-[11px] font-medium text-white hover:bg-[#1765cc]">
                  Send
                </button>
              </div>
              <button className="flex w-full items-center justify-center gap-1.5 rounded border border-slate-300 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <Copy className="h-3.5 w-3.5" />
                Copy link
              </button>
            </div>
          </div>
        </Section>

        {/* ================= Comments mock ================= */}
        <Section title="Comments">
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
              <p className="mb-0.5 font-medium">Commenting on:</p>
              <p className="line-clamp-1 italic">
                “the new onboarding flow should ship with analytics”
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Avatar initials="MJ" color="#EA4335" size={24} />
                <div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    Marcus Johnson
                  </p>
                  <p className="text-[10px] text-slate-400">2m ago</p>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                Agreed — let’s also add a fallback for users without a team.
              </p>
              <div className="mt-2.5 flex items-center gap-3 border-t border-slate-100 pt-2 dark:border-slate-800">
                <button className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-violet-600 dark:text-slate-400">
                  <CheckCheck className="h-3.5 w-3.5" />
                  Resolve
                </button>
                <button className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-violet-600 dark:text-slate-400">
                  <Send className="h-3.5 w-3.5" />
                  Reply
                </button>
                <span className="ml-auto text-[10px] text-slate-400">1 reply</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ================= Stats ================= */}
        <Section title="Profile stats">
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<FileText className="h-4 w-4" />} label="Owned docs" value="12" />
            <Stat icon={<Users className="h-4 w-4" />} label="Shared with me" value="8" />
            <Stat icon={<FolderOpen className="h-4 w-4" />} label="Open rooms" value="3" />
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-pink-50 p-4 dark:border-slate-800 dark:from-indigo-950/40 dark:via-violet-950/40 dark:to-pink-950/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-pink-600 text-sm font-bold text-white">
              AK
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Aisha Khan
              </p>
              <p className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Mail className="h-3 w-3" />
                aisha@example.com
              </p>
            </div>
            <button className="flex items-center gap-1.5 rounded-md bg-[#1a73e8] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#1765cc]">
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          </div>
        </Section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* CTA footer */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:text-left">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Ready to build together?
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create a document, invite teammates, and start writing in real
              time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800">
              Explore docs
            </button>
            <button className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition hover:opacity-90">
              <Bell className="h-4 w-4" />
              Start free
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-12 flex max-w-6xl items-center justify-between px-4 text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[9px] font-bold text-white">
            CF
          </div>
          CollabFlow UI Showcase
        </div>
        <div className="flex items-center gap-4">
          <Eye className="h-3.5 w-3.5" />
          <MessageSquare className="h-3.5 w-3.5" />
          <Users className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            Toggle theme in the header to see both modes
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Small building blocks used only by the showcase                          */
/* ------------------------------------------------------------------------ */

function Section({
  title,
  span = false,
  children,
}: {
  title: string;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 ${
        span ? "md:col-span-2" : ""
      }`}
    >
      <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Badge({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function Avatar({
  initials,
  color,
  online = false,
  size = 36,
}: {
  initials: string;
  color: string;
  online?: boolean;
  size?: number;
}) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      title={initials}
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white dark:border-slate-900"
        style={{ backgroundColor: color, fontSize: size * 0.32 }}
      >
        {initials}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-green-500 dark:border-slate-900"
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </div>
  );
}

function CardDoc({
  color,
  title,
  meta,
  badge,
}: {
  color: string;
  title: string;
  meta: string;
  badge?: string;
}) {
  return (
    <div className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-violet-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div
        className="flex flex-1 items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <div className="flex h-12 w-10 items-center justify-center rounded-t-sm bg-white/90 shadow-sm">
          <FileText className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <div className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-500 opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100">
        <MoreVertical className="h-4 w-4" />
      </div>
      <div className="border-t border-slate-100 p-3 dark:border-slate-800">
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
          {title}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">{meta}</p>
          {badge && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolChip({
  icon,
  title,
  active = false,
}: {
  icon: string;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded text-xs text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${
        active ? "bg-violet-100 font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300" : ""
      }`}
    >
      {icon}
    </button>
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
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
      <div className="mb-1 flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}
