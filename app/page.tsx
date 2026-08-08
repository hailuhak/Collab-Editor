import Link from "next/link";
import {
  ArrowRight,
  History,
  Lock,
  MessageSquare,
  ShieldCheck,
  Type,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: Zap,
    gradient: "from-indigo-600 to-violet-600",
    title: "Live co-editing",
    description:
      "See changes instantly as your team types, with low-latency sync and real-time cursor tracking.",
  },
  {
    icon: Type,
    gradient: "from-violet-600 to-fuchsia-600",
    title: "Rich text editor",
    description:
      "A fast Tiptap-powered editor with headings, lists, code blocks, and images — no markdown required.",
  },
  {
    icon: MessageSquare,
    gradient: "from-fuchsia-600 to-pink-600",
    title: "Inline comments",
    description:
      "Discuss specific text, resolve threads, and keep the conversation attached to the document.",
  },
  {
    icon: History,
    gradient: "from-indigo-600 to-violet-600",
    title: "Version history",
    description:
      "Every change is tracked. Revisit or restore any previous version of your document.",
  },
  {
    icon: ShieldCheck,
    gradient: "from-violet-600 to-fuchsia-600",
    title: "Granular permissions",
    description:
      "Share with editors, commenters, or viewers. Full control over who can access each document.",
  },
  {
    icon: Lock,
    gradient: "from-fuchsia-600 to-pink-600",
    title: "Secure by default",
    description:
      "Encrypted sessions, hardened password flows, and role-based access on every document.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your workspace",
    description:
      "Sign up in seconds with your email or Google account. No credit card, no setup required.",
  },
  {
    number: "02",
    title: "Invite your team",
    description:
      "Share a link and set the right permissions — edit, comment, or view — for every collaborator.",
  },
  {
    number: "03",
    title: "Write together in real time",
    description:
      "Watch cursors move, leave comments, and track version history as your team works in sync.",
  },
];

const stats = [
  { value: "<10ms", label: "Sync latency" },
  { value: "99.9%", label: "Uptime" },
  { value: "Unlimited", label: "Collaborators" },
  { value: "256-bit", label: "Session encryption" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] text-slate-900 transition-colors dark:bg-[#0A0E1A] dark:text-slate-100">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0A0E1A]/80 md:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[11px] font-bold text-white shadow-sm">
            CF
          </div>
          <span className="text-sm font-semibold tracking-tight">CollabFlow</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            How it works
          </a>
        </nav>

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
        <section className="relative overflow-hidden">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 blur-3xl dark:from-indigo-500/20 dark:via-violet-500/15 dark:to-pink-500/20" />
            <div
              className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(148 163 184 / 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.14) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 text-center md:pb-24 md:pt-24">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
              Real-time collaboration engine
            </span>

            <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Edit documents together,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
                in real time
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              A fast, secure, and intuitive rich-text editor built for teams.
              Write, edit, track version history, and manage permissions
              seamlessly.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                className="group flex w-full items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition hover:opacity-90 sm:w-auto"
                href="/register"
              >
                Start writing free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                className="w-full rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto"
                href="/login"
              >
                Sign in to workspace
              </Link>
            </div>

            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              Free for individuals · No credit card required
            </p>

            {/* Signature element: live editor preview with multiplayer cursors */}
            <div className="relative mx-auto mt-14 max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl shadow-slate-300/50 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                <span className="h-2 w-2 rounded-full bg-red-300 dark:bg-red-500/50" />
                <span className="h-2 w-2 rounded-full bg-amber-300 dark:bg-amber-500/50" />
                <span className="h-2 w-2 rounded-full bg-green-300 dark:bg-green-500/50" />
                <span className="ml-2 text-[11px] text-slate-400 dark:text-slate-500">
                  Q3-roadmap.doc
                </span>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  3 editing
                </span>
              </div>

              <div className="space-y-2.5 px-5 py-6">
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

                <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex -space-x-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-semibold text-white ring-2 ring-white dark:ring-slate-900">
                      M
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[9px] font-semibold text-white ring-2 ring-white dark:ring-slate-900">
                      T
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-semibold text-white ring-2 ring-white dark:ring-slate-900">
                      A
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-[9px] font-medium text-slate-400 ring-2 ring-white dark:border-slate-600 dark:bg-slate-800 dark:ring-slate-900">
                      +2
                    </span>
                  </div>
                  <span className="ml-2 text-[10px] text-slate-400 dark:text-slate-500">
                    Saved just now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="scroll-mt-16 bg-[#FAFAF8] py-16 dark:bg-[#0A0E1A] md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
                Features
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Everything you need to collaborate seamlessly
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                From first draft to final version, CollabFlow keeps your whole
                team in sync.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-violet-800"
                >
                  <div
                    className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} text-white shadow-sm`}
                  >
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-16 border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40 md:py-20"
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
                How it works
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Up and running in three steps
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Start collaborating with your team in less than a minute.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative rounded-xl border border-slate-200 bg-[#FAFAF8] p-6 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#FAFAF8] py-16 dark:bg-[#0A0E1A] md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 px-6 py-12 text-center shadow-xl shadow-violet-600/20 md:px-12">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Ready to collaborate in real time?
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-indigo-100">
                  Join CollabFlow today and give your team a shared space to
                  write, review, and ship great documents.
                </p>
                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    className="w-full rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 sm:w-auto"
                    href="/register"
                  >
                    Get started free
                  </Link>
                  <Link
                    className="w-full rounded-md border border-white/40 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto"
                    href="/login"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0A0E1A]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-[11px] font-bold text-white shadow-sm">
                  CF
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  CollabFlow
                </span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                The real-time collaborative editor for modern teams.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Product
              </h4>
              <ul className="mt-3 space-y-2">
                {["Features", "How it works", "Security", "Pricing"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#features"
                        className="text-xs text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Account
              </h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/login"
                    className="text-xs text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-xs text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    Create account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    Reset password
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Legal
              </h4>
              <ul className="mt-3 space-y-2">
                {["Privacy", "Terms", "Cookies"].map((item) => (
                  <li key={item}>
                    <span className="cursor-not-allowed text-xs text-slate-500 dark:text-slate-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} CollabFlow. Real-time collaborative
              editor.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Status</span>
              <span>Docs</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
