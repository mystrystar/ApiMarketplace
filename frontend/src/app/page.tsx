"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleUserRound,
  Crown,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/constants";

const DEMO = {
  admin: {
    email: "admin@marketplace.local",
    password: "admin123",
    title: "Admin Sign in",
    subtitle: "Secure access for platform administrators",
    button: "Sign in as Admin",
    accent: "from-[#2563eb] to-[#7c3aed]",
    ring: "border-[#2563eb]/35 bg-[#2563eb]/10 text-[#60a5fa]",
    bullets: ["Approve and publish APIs", "Manage consumers and providers", "Track revenue, usage, and logs"],
  },
  consumer: {
    email: "consumer@marketplace.local",
    password: "consumer123",
    title: "Consumer Sign in",
    subtitle: "Access and manage your APIs, subscriptions & applications",
    button: "Sign in as Consumer",
    accent: "from-[#a855f7] to-[#2563eb]",
    ring: "border-[#8b5cf6]/35 bg-[#7c3aed]/10 text-[#c084fc]",
    bullets: ["Browse and subscribe to APIs", "Copy keys and refill quota", "Monitor traffic and response health"],
  },
} as const;

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
        <span className="text-2xl font-black text-cyan-300">A</span>
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[#8b5cf6] shadow-[0_0_18px_#8b5cf6]" />
      </div>
      <div>
        <p className="text-lg font-bold text-white">API Marketplace</p>
        <p className="text-xs text-[#7dd3fc]">Developer Gateway</p>
      </div>
    </div>
  );
}

function SignInCard({
  kind,
  onDemoLogin,
  loadingRole,
}: {
  kind: keyof typeof DEMO;
  onDemoLogin: (role: keyof typeof DEMO) => void;
  loadingRole: keyof typeof DEMO | null;
}) {
  const item = DEMO[kind];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#101a38]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      <div className={`mb-5 grid h-16 w-16 place-items-center rounded-2xl border ${item.ring}`}>
        {kind === "admin" ? <Crown className="h-8 w-8" /> : <CircleUserRound className="h-8 w-8" />}
      </div>
      <h2 className="text-xl font-semibold text-white">{item.title}</h2>
      <p className="mt-2 min-h-10 text-sm leading-6 text-slate-300">{item.subtitle}</p>

      <div className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Email
          </span>
          <input
            readOnly
            value={item.email}
            className="w-full rounded-xl border border-white/10 bg-[#071126]/70 px-4 py-3 text-sm text-slate-200 shadow-inner"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Password
          </span>
          <input
            readOnly
            type="password"
            value={item.password}
            className="w-full rounded-xl border border-white/10 bg-[#071126]/70 px-4 py-3 text-sm text-slate-200 shadow-inner"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => onDemoLogin(kind)}
        disabled={Boolean(loadingRole)}
        className={`mt-5 w-full rounded-xl bg-gradient-to-r ${item.accent} px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {loadingRole === kind ? "Signing in..." : item.button}
      </button>

      <ul className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-3">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-400/10 text-cyan-300">
              <Check className="h-3.5 w-3.5" />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl rounded-[2rem] border border-white/10 bg-[#07142b]/80 p-4 shadow-[0_30px_120px_rgba(37,99,235,0.18)] backdrop-blur-xl">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.3fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1834] p-5">
          <p className="text-sm font-semibold text-cyan-300">How it works</p>
          <h3 className="mt-3 text-2xl font-bold text-white">From discovery to metered calls in minutes.</h3>
          <div className="mt-6 space-y-4">
            {[
              ["1", "Browse APIs", "Filter by category, price, method, or provider quality."],
              ["2", "Subscribe & get a key", "Buy quota packs and copy the generated API key."],
              ["3", "Track every request", "Watch quota, latency, status codes, and recent activity."],
            ].map(([step, title, copy]) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-400/10 font-bold text-cyan-300">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1834] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Consumer analytics mockup</p>
              <h3 className="text-xl font-bold text-white">API Usage Overview</h3>
            </div>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
              Last 7 days
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["12,540", "Total Calls", "↗ 18.6%"],
              ["99.98%", "Success Rate", "↗ healthy"],
              ["Pro", "Current Plan", "Manage"],
            ].map(([value, label, delta]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-mono text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
                <p className="mt-3 text-xs text-emerald-300">{delta}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 h-52 rounded-2xl border border-white/10 bg-[#081126] p-4">
            <svg viewBox="0 0 680 180" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="landingLine" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 150 C95 120 120 95 205 105 C285 115 300 38 392 54 C485 70 505 142 680 82 L680 180 L0 180 Z" fill="url(#landingLine)" />
              <path d="M0 150 C95 120 120 95 205 105 C285 115 300 38 392 54 C485 70 505 142 680 82" fill="none" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
              {[0, 205, 392, 680].map((x, index) => (
                <circle key={x} cx={x} cy={[150, 105, 54, 82][index]} r="5" fill="#22d3ee" />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { demoLogin, user } = useAuth();
  const [loadingRole, setLoadingRole] = useState<keyof typeof DEMO | null>(null);
  const [error, setError] = useState("");

  async function handleDemoLogin(role: keyof typeof DEMO) {
    setLoadingRole(role);
    setError("");
    try {
      await demoLogin(role === "admin" ? "ADMIN" : "USER");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to sign in with the seeded demo account.",
      );
    } finally {
      setLoadingRole(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02071a] px-5 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(37,99,235,0.28),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(124,58,237,0.32),transparent_28%),radial-gradient(circle_at_55%_90%,rgba(6,182,212,0.15),transparent_35%)]" />
      <div className="pointer-events-none absolute right-[-140px] top-20 h-[420px] w-[620px] rounded-full border border-fuchsia-400/20 bg-[radial-gradient(circle,rgba(168,85,247,0.16),transparent_65%)] blur-sm" />
      <div className="pointer-events-none absolute left-0 top-16 hidden h-[330px] w-[280px] opacity-40 md:block">
        <div className="h-full w-full bg-[linear-gradient(135deg,transparent_0_42%,rgba(37,99,235,0.22)_42%_43%,transparent_43%_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <div className="text-right text-xs text-slate-300">
            <p className="font-semibold text-white">Need help?</p>
            <a href="mailto:support@marketplace.local" className="text-cyan-300">
              Contact API Marketplace Team
            </a>
          </div>
        </header>

        <section className="mx-auto mt-14 max-w-4xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Secure API commerce, usage analytics, and admin control
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
              API Marketplace
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Connect, integrate, and scale with trusted APIs. Consumers discover and track usage;
            admins approve, meter, and manage the platform from a modern command center.
          </p>
          {user && (
            <Link
              href={user.role === "ADMIN" ? ROUTES.admin : ROUTES.dashboard}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100"
            >
              <span>Continue to your {user.role === "ADMIN" ? "admin" : "consumer"} portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <SignInCard kind="admin" onDemoLogin={handleDemoLogin} loadingRole={loadingRole} />
          <SignInCard kind="consumer" onDemoLogin={handleDemoLogin} loadingRole={loadingRole} />
          <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d2437]/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-teal-300/30 bg-teal-300/10 text-teal-200">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-white">New User?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Create a consumer account to browse APIs, subscribe to quota packs, and view analytics.
            </p>
            <ul className="mt-7 space-y-4 text-sm text-slate-300">
              {["Browse and subscribe to APIs", "Manage your applications", "View usage and analytics"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-teal-300/40 text-teal-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={ROUTES.signup}
              className="mt-8 flex w-full justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-3 text-sm font-bold text-[#03121f] shadow-[0_12px_30px_rgba(20,184,166,0.2)]"
            >
              Create Consumer Account
            </Link>
            <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-xs leading-5 text-slate-300">
              Admin access is seeded and protected. For admin invites, contact the API Marketplace team.
            </div>
          </article>
        </section>

        {error && (
          <p className="mx-auto mt-5 max-w-xl rounded-2xl border border-rose-400/25 bg-rose-400/10 p-4 text-center text-sm text-rose-200">
            {error}
          </p>
        )}

        <DashboardPreview />

        <section className="mx-auto mt-12 grid max-w-6xl gap-4 text-sm text-slate-300 md:grid-cols-4">
          {[
            [Sparkles, "Secure & Reliable", "Enterprise-grade key handling"],
            [TrendingUp, "Scalable Platform", "Built to grow with your API catalog"],
            [ShieldCheck, "Trusted APIs", "Quality APIs reviewed by admins"],
            [CheckCircle2, "Developer First", "Docs, keys, logs, and usage in one place"],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-lg text-cyan-300"><Icon className="h-5 w-5" /></p>
              <p className="mt-2 font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs text-slate-400">{copy}</p>
            </div>
          ))}
        </section>

        <footer className="py-10 text-center text-xs text-slate-500">
          © 2026 API Marketplace. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
