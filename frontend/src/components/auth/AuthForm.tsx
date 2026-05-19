"use client";

import { useState } from "react";
import Link from "next/link";
import { AUTH_LABELS, ROUTES } from "@/constants";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(email, password, name || undefined);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="console-panel relative mx-auto w-full max-w-[420px] rounded-[var(--radius-lg)] p-9">
      <div className="mb-7 text-center">
        <p className="text-xl font-bold">
          <span className="text-[var(--accent)]">API</span>{" "}
          <span className="text-white">Marketplace</span>
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">Developer Gateway</p>
      </div>
      <h1 className="mb-5 text-[22px] font-semibold text-[var(--text)]">
        {isLogin ? AUTH_LABELS.loginTitle : AUTH_LABELS.signupTitle}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <Input
            label={AUTH_LABELS.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <Input
          label={AUTH_LABELS.email}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label={AUTH_LABELS.password}
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-1 w-full py-[11px] text-sm">
          {isLogin ? AUTH_LABELS.loginBtn : AUTH_LABELS.signupBtn}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        {isLogin ? AUTH_LABELS.noAccount : AUTH_LABELS.hasAccount}{" "}
        <Link
          href={isLogin ? ROUTES.signup : ROUTES.login}
          className="text-[var(--accent)] underline"
        >
          {isLogin ? AUTH_LABELS.signupBtn : AUTH_LABELS.loginBtn}
        </Link>
      </p>
    </div>
  );
}
