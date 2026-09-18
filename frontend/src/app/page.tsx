"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Check, ChevronRight, Menu, X } from "lucide-react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/constants";

type Role = "user" | "admin";

const CREDENTIALS = {
  user: { email: "consumer@marketplace.local", password: "consumer123", title: "Sign in", button: "Sign in" },
  admin: { email: "admin@marketplace.local", password: "admin123", title: "Admin sign in", button: "Sign in as admin" },
} as const;

const apis = [
  ["Geocode", "Turn an address into coordinates", "GeoLine", "GET", "$0.40", "92 ms", "99.98%"],
  ["Address verify", "Check and standardize postal addresses", "PostalGrid", "POST", "$1.20", "140 ms", "99.95%"],
  ["Currency rates", "Live and historical exchange rates", "LedgerFX", "GET", "$0.25", "48 ms", "99.99%"],
  ["Invoice parser", "Extract line items from PDF invoices", "Ledgerly", "POST", "$6.00", "820 ms", "99.90%"],
  ["Weather forecast", "Daily and hourly forecasts by city", "Nimbus Data", "GET", "$0.30", "76 ms", "99.97%"],
  ["Text sentiment", "Score reviews and messages as positive or negative", "Lexis Labs", "POST", "$0.90", "210 ms", "99.92%"],
] as const;

function Brand() {
  return <Link href={ROUTES.home} className="flex items-center gap-2 font-bold text-white"><span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[#4c84ff] to-[#8b5cf6] text-sm">↕</span>API Marketplace</Link>;
}

function UsagePreview() {
  return <div className="overflow-hidden rounded-xl border border-[#26345e] bg-[#0b1430] shadow-[0_20px_60px_rgba(0,0,0,.26)]">
    <div className="grid grid-cols-3 divide-x divide-[#26345e] border-b border-[#26345e]">
      {[["12,540", "Calls in 7 days"], ["99.98%", "Success rate"], ["Pro", "Current plan"]].map(([n, l]) => <div key={l} className="p-4"><p className="text-xl font-bold text-white">{n}</p><p className="text-[10px] text-slate-400">{l}</p></div>)}
    </div>
    <div className="h-36 border-b border-[#26345e] px-4 pt-4"><svg viewBox="0 0 480 110" className="h-full w-full"><defs><linearGradient id="graph" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#8b5cf6" stopOpacity=".48"/><stop offset="1" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient></defs><path d="M5 88 L75 78 L150 82 L230 40 L315 55 L390 25 L475 31 L475 110 L5 110Z" fill="url(#graph)"/><path d="M5 88 L75 78 L150 82 L230 40 L315 55 L390 25 L475 31" fill="none" stroke="#9563ff" strokeWidth="3"/><circle cx="230" cy="40" r="4" fill="#22d3ee"/><circle cx="475" cy="31" r="4" fill="#22d3ee"/></svg></div>
    <div className="p-3 font-mono text-[9px] leading-6 text-slate-400"><b className="font-sans text-xs text-white">Recent requests</b><p>10:42:07&nbsp;&nbsp;GET /v1/geocode?q=Lisbon <span className="float-right text-emerald-400">200&nbsp; 88 ms</span></p><p>10:42:05&nbsp;&nbsp;GET /v1/rates?base=USD <span className="float-right text-emerald-400">200&nbsp; 51 ms</span></p><p>10:41:58&nbsp;&nbsp;POST /v1/sentiment <span className="float-right text-emerald-400">200&nbsp; 204 ms</span></p></div>
  </div>;
}

export default function HomePage() {
  const { login, user } = useAuth();
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState<string>(CREDENTIALS.user.email);
  const [password, setPassword] = useState<string>(CREDENTIALS.user.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function selectRole(next: Role) { setRole(next); setEmail(CREDENTIALS[next].email); setPassword(CREDENTIALS[next].password); setError(""); }
  function openLogin(next: Role = "user") { selectRole(next); document.getElementById("signin")?.scrollIntoView({ behavior: "smooth", block: "center" }); }
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); try { await login(email, password); } catch (err) { setError(err instanceof ApiError ? err.message : "Unable to sign in. Please try again."); } finally { setLoading(false); } }

  return <main className="min-h-screen overflow-hidden bg-[#050b22] text-[#e7edff]">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_72%_13%,rgba(89,53,201,.19),transparent_20%),radial-gradient(circle_at_12%_75%,rgba(37,99,235,.12),transparent_24%)]" />
    <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
      <header className="flex h-20 items-center justify-between"><Brand /><nav className="hidden items-center gap-7 text-xs text-slate-400 md:flex"><a href="#catalog" className="hover:text-white">Browse APIs</a><a href="#how-it-works" className="hover:text-white">How it works</a><button onClick={() => openLogin()} className="hover:text-white">Sign in</button><button onClick={() => openLogin()} className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-[#041127] hover:bg-cyan-300">Get an API key</button></nav><button className="text-slate-300 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button></header>
      {menuOpen && <nav className="mb-4 grid rounded-xl border border-[#26345e] bg-[#0b1430] p-3 text-sm md:hidden"><a href="#catalog" onClick={() => setMenuOpen(false)} className="p-3">Browse APIs</a><a href="#how-it-works" onClick={() => setMenuOpen(false)} className="p-3">How it works</a><button onClick={() => { setMenuOpen(false); openLogin(); }} className="p-3 text-left">Sign in</button></nav>}

      <section className="grid min-h-[440px] items-center gap-12 py-12 md:grid-cols-[1fr_.95fr] md:py-20">
        <div><h1 className="max-w-md text-5xl font-bold leading-[.98] tracking-tight text-[#f1f4ff] sm:text-6xl">Find an API.<br/>Get a key.<br/>Make the call today.</h1><p className="mt-5 max-w-md text-sm leading-6 text-slate-400">Browse APIs from vetted providers, buy a quota pack, and see every request you make: status, speed, and what&apos;s left in your quota.</p><div className="mt-6 flex flex-wrap gap-3"><a href="#catalog" className="rounded-lg bg-[#497cff] px-4 py-3 text-xs font-bold text-white">Browse APIs</a><Link href={ROUTES.signup} className="rounded-lg bg-cyan-400 px-4 py-3 text-xs font-bold text-[#041127]">Create a free account</Link></div><p className="mt-5 text-xs text-slate-500">Already have an account? <button onClick={() => openLogin()} className="font-semibold text-white underline">Sign in</button></p></div>
        <div className="rounded-xl border border-[#26345e] bg-[#070d22] shadow-[0_18px_55px_rgba(21,8,78,.45)]"><div className="flex gap-1 border-b border-[#26345e] px-3 pt-2 text-[10px] text-slate-400"><span className="rounded-t bg-[#1d2b55] px-3 py-2 text-white">Geocode</span><span className="px-3 py-2">Currency rates</span><span className="px-3 py-2">Weather</span></div><div className="p-4 font-mono text-[10px] leading-5"><p className="text-amber-300">GET <span className="text-slate-200">/v1/geocode?q=Lisbon,Portugal</span></p><p className="text-slate-500">Host: <span className="text-[#9ab2ff]">api.marketplace.dev</span><br/>Authorization: Bearer <span className="text-[#9ab2ff]">mk_live_••••8f2a</span></p><button className="my-3 rounded bg-[#7652ed] px-4 py-2 font-sans text-xs font-bold text-white">Send again</button><p className="border-t border-[#26345e] pt-3 text-emerald-400">● 200 OK <span className="ml-4 text-slate-500">49 ms&nbsp; 62 bytes</span></p><pre className="mt-2 text-[#a9c5ff]">{`{\n  "lat": 38.7223,\n  "lng": -9.1393,\n  "country": "PT",\n  "confidence": 0.98\n}`}</pre><p className="mt-3 text-slate-500">Quota: 9,999 of 10,000 calls left</p><div className="mt-1 h-1 rounded bg-[#8057f4]"/></div></div>
      </section>

      <section id="catalog" className="scroll-mt-8 py-14"><h2 className="text-3xl font-bold">Browse the catalog</h2><p className="mt-2 max-w-lg text-sm text-slate-400">Filter by category, method, or provider. Every listing shows its price and real-world speed before you subscribe.</p><div className="mt-6 flex flex-wrap gap-2"><input placeholder="Search APIs or providers" className="w-full rounded-lg border border-[#26345e] bg-[#0a1230] px-3 py-2 text-xs outline-none placeholder:text-slate-500 sm:w-56"/>{["All", "Maps", "Finance", "Weather", "AI & text"].map((filter, i) => <button key={filter} className={`rounded-full border px-3 py-2 text-[10px] ${i === 0 ? "border-[#7060e7] bg-[#6c57e8] text-white" : "border-[#26345e] text-slate-300"}`}>{filter}</button>)}</div><div className="mt-3 overflow-x-auto rounded-xl border border-[#26345e]"><table className="w-full min-w-[720px] text-left text-xs"><thead className="border-b border-[#26345e] text-[9px] uppercase text-slate-500"><tr><th className="p-3">API</th><th>Provider</th><th>Method</th><th>Price per 1,000 calls</th><th>Median speed</th><th>Uptime</th><th/></tr></thead><tbody>{apis.map(([name, desc, provider, method, price, speed, uptime]) => <tr key={name} className="border-b border-[#1e2a4d] last:border-0"><td className="p-3"><b className="text-white">{name}</b><small className="mt-1 block text-[10px] text-slate-500">{desc}</small></td><td className="text-slate-300">{provider}</td><td><span className={`rounded px-2 py-1 text-[9px] ${method === "GET" ? "bg-[#253566] text-[#9db6ff]" : "bg-[#4a3926] text-amber-300"}`}>{method}</span></td><td className="font-mono text-[10px]">{price}</td><td className="font-mono text-[10px]">{speed}</td><td className="font-mono text-[10px] text-emerald-400">{uptime}</td><td><button onClick={() => openLogin()} className="font-semibold text-cyan-400">Subscribe</button></td></tr>)}</tbody></table></div><p className="mt-3 text-[10px] text-slate-500">Sample listings shown. Admins review every provider before an API is published.</p></section>

      <section id="how-it-works" className="grid scroll-mt-8 gap-9 py-16 md:grid-cols-[.9fr_1fr]"><div><h2 className="max-w-sm text-3xl font-bold leading-tight">From first request to usage report</h2><div className="mt-6 space-y-6 border-l border-[#26345e] pl-6">{[["1", "Pick an API", "Compare price, speed, and uptime side by side, then subscribe to a quota pack that fits your traffic."], ["2", "Copy your key", "Your key is created when you subscribe. Send it as a Bearer token and your first call works right away."], ["3", "Watch your usage", "See calls, success rate, response times, and remaining quota. Refill before you run out."]].map(([n,title,copy]) => <div key={n} className="relative"><span className="absolute -left-10 grid h-6 w-6 place-items-center rounded-full bg-[#5c62ee] text-xs font-bold">{n}</span><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p></div>)}</div></div><UsagePreview /></section>

      <section id="signin" className="grid scroll-mt-12 items-center gap-10 py-16 md:grid-cols-2"><div><h2 className="max-w-sm text-3xl font-bold leading-tight">Get your key in about a minute</h2><ul className="mt-7 space-y-3 text-sm text-slate-400">{["Browse and subscribe. Pick APIs and buy quota packs.", "Manage your apps. Keep a separate key for each project.", "Track every request. Quota, speed, and status codes in one place."].map(item => <li key={item} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-emerald-400"/>{item}</li>)}</ul></div><div className="rounded-xl border border-[#26345e] bg-[#0d1734] p-5 shadow-[0_20px_65px_rgba(19,14,65,.4)]"><div className="mb-5 inline-flex rounded-lg bg-[#070d22] p-1 text-xs"><button onClick={() => selectRole("user")} className={`rounded px-3 py-2 ${role === "user" ? "bg-[#263565] text-white" : "text-slate-400"}`}>Sign in</button><button onClick={() => selectRole("admin")} className={`rounded px-3 py-2 ${role === "admin" ? "bg-[#263565] text-white" : "text-slate-400"}`}>Admin sign in</button></div><h2 className="text-lg font-bold">{CREDENTIALS[role].title}</h2><p className="mt-1 text-xs text-slate-400">{role === "admin" ? "For platform administrators. Approve APIs, manage providers, and review usage." : "Manage your APIs, subscriptions, and keys."}</p><form onSubmit={submit} className="mt-5 space-y-4"><label className="block text-xs font-bold">Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-[#26345e] bg-[#060c20] px-3 py-3 text-sm font-normal outline-none focus:border-[#5f7fff]"/></label><label className="block text-xs font-bold">Password<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-[#26345e] bg-[#060c20] px-3 py-3 text-sm font-normal outline-none focus:border-[#5f7fff]"/></label>{error && <p className="text-xs text-rose-300">{error}</p>}<button disabled={loading} className="w-full rounded-lg bg-gradient-to-r from-[#407cff] to-[#8951ed] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? "Signing in..." : CREDENTIALS[role].button}</button></form><div className="mt-7 border-t border-[#26345e] pt-4 text-xs text-slate-400">{role === "admin" ? <>Not an admin? <button onClick={() => selectRole("user")} className="font-semibold text-white underline">Back to developer sign in</button></> : <>New here? <Link href={ROUTES.signup} className="font-semibold text-white underline">Create an account</Link> · <button onClick={() => selectRole("admin")} className="font-semibold text-white underline">Sign in as admin</button></>}</div></div></section>
      {user && <Link href={user.role === "ADMIN" ? ROUTES.admin : ROUTES.dashboard} className="fixed bottom-5 right-5 rounded-full bg-cyan-400 px-4 py-3 text-xs font-bold text-[#041127] shadow-lg">Continue to dashboard <ChevronRight className="inline h-3 w-3"/></Link>}
      <footer className="flex flex-col gap-3 border-t border-[#1b2850] py-7 text-[10px] text-slate-500 sm:flex-row sm:justify-between"><span>© 2026 API Marketplace</span><span className="flex gap-5"><a href="#catalog">Browse APIs</a><a href="#how-it-works">How it works</a><a href="#signin">Contact the team</a></span></footer>
    </div>
  </main>;
}
