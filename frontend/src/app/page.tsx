"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(
      user ? (user.role === "ADMIN" ? ROUTES.admin : ROUTES.marketplace) : ROUTES.login,
    );
  }, [loading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-sm text-[var(--text-muted)]">
      Loading...
    </div>
  );
}
