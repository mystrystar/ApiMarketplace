"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useAuth } from "@/lib/auth-context";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.home);
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-sm text-[var(--text-muted)]">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--bg-primary)]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(37,99,235,0.2),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(124,58,237,0.18),transparent_28%),linear-gradient(135deg,#02071a_0%,#06152d_55%,#020617_100%)]" />
      <div className="pointer-events-none fixed right-[-180px] top-[-80px] h-[420px] w-[600px] rounded-full border border-fuchsia-400/10 bg-fuchsia-500/10 blur-2xl" />
      <Sidebar />
      <main className="relative z-10 flex-1 overflow-auto p-4 pb-24 md:p-8">{children}</main>
      <OnboardingModal user={user} />
    </div>
  );
}
