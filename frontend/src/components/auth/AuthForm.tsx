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
    <div className="mx-auto w-full max-w-md rounded border border-gray-200 bg-white p-6">
      <h1 className="mb-4 text-xl font-semibold">
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {isLogin ? AUTH_LABELS.loginBtn : AUTH_LABELS.signupBtn}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? AUTH_LABELS.noAccount : AUTH_LABELS.hasAccount}{" "}
        <Link
          href={isLogin ? ROUTES.signup : ROUTES.login}
          className="text-gray-900 underline"
        >
          {isLogin ? AUTH_LABELS.signupBtn : AUTH_LABELS.loginBtn}
        </Link>
      </p>
    </div>
  );
}
