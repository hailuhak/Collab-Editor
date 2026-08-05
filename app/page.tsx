import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] text-slate-900 transition-colors dark:bg-[#0A0E1A] dark:text-slate-100">
      {/* Navigation Bar */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm dark:border-slate-800/80 dark:bg-[#0A0E1A]/80 md:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[11px] font-bold text-white shadow-sm">
            CF
          </div>
          <span className="text-sm font-semibold tracking-tight">CollabFlow</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-violet-600/20 transition hover:opacity-90"
            href="/register"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center md:pb-24 md:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
            Real-time collaboration engine
          </span>

          <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Edit documents together,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
              in real time
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            A fast, secure, and intuitive rich-text editor built for teams.
            Write, edit, track version history, and manage permissions
            seamlessly.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              className="w-full rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition hover:opacity-90 sm:w-auto"
              href="/register"
            >
              Start writing free
            </Link>
            <Link
              className="w-full rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
              href="/login"
            >
              Sign in to workspace
            </Link>
          </div>

          {/* Signature element: live editor preview with multiplayer cursors */}
          <div className="relative mx-auto mt-14 max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
            <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
              <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span className="ml-2 text-[11px] text-slate-400 dark:text-slate-500">
                Q3-roadmap.doc
              </span>
            </div>
            <div className="space-y-2.5 px-5 py-5">
              <div className="h-2.5 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="relative h-2.5 w-11/12 rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="absolute -top-5 left-[38%] flex items-center gap-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-medium text-white shadow">
                  <span className="h-1 w-1 rounded-full bg-white" /> Mia
                </span>
                <span className="absolute -right-0.5 top-0 h-2.5 w-0.5 rounded-full bg-indigo-600" />
              </div>
              <div className="h-2.5 w-1/2 rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="relative h-2.5 w-4/5 rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="absolute -top-5 left-[62%] flex items-center gap-1 rounded-full bg-pink-600 px-1.5 py-0.5 text-[9px] font-medium text-white shadow">
                  <span className="h-1 w-1 rounded-full bg-white" /> Theo
                </span>
                <span className="absolute right-[18%] top-0 h-2.5 w-0.5 rounded-full bg-pink-600" />
              </div>
              <div className="h-2.5 w-3/5 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
              Everything you need to collaborate seamlessly
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-lg border border-slate-200 bg-[#FAFAF8] p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold">Live co-editing</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  See changes instantly as teammates type, with low-latency
                  sync and real-time cursor tracking.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-lg border border-slate-200 bg-[#FAFAF8] p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-sm">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold">Rich text editor</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Powered by Tiptap. Format code blocks, headings, lists, and
                  images effortlessly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-lg border border-slate-200 bg-[#FAFAF8] p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white shadow-sm">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold">Secure access & history</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Manage document permissions, roles, and review previous
                  versions anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-[#0A0E1A] dark:text-slate-400">
        © {new Date().getFullYear()} CollabFlow. Real-time collaborative editor.
      </footer>
    </div>
  );
}