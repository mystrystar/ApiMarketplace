"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types";

const onboardingContent = {
  ADMIN: {
    welcomeTitle: "Welcome to the Admin Portal",
    welcomeSubtitle: "Manage APIs and platform operations efficiently.",
    features: [
      "API approval & moderation",
      "Revenue monitoring",
      "Purchase management",
      "API lifecycle management",
      "Platform insights",
      "User management",
    ],
    quickStart: "Review APIs and platform activity from your dashboard.",
    cta: "Go to Dashboard",
    ctaRoute: ROUTES.admin,
  },
  CONSUMER: {
    welcomeTitle: "Welcome to API Marketplace",
    welcomeSubtitle: "Discover, subscribe to, and manage APIs from one place.",
    features: [
      "Browse Marketplace APIs",
      "Purchase API access",
      "Manage subscriptions",
      "Access API keys",
      "Track quota & usage",
      "Purchase history",
    ],
    quickStart: "Start by exploring the Marketplace and subscribe to your first API.",
    cta: "Explore Marketplace",
    ctaRoute: ROUTES.marketplace,
  },
} as const;

type Props = {
  user: User;
};

function getOnboardingKey(role: User["role"]) {
  return role === "ADMIN" ? "onboarding_seen_admin" : "onboarding_seen_consumer";
}

export function OnboardingModal({ user }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const onboardingKey = useMemo(() => getOnboardingKey(user.role), [user.role]);
  const content = useMemo(
    () => onboardingContent[user.role === "ADMIN" ? "ADMIN" : "CONSUMER"],
    [user.role],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setStep(0);
      try {
        setIsOpen(sessionStorage.getItem(onboardingKey) !== "true");
      } catch {
        setIsOpen(false);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [onboardingKey]);

  const completeOnboarding = () => {
    try {
      sessionStorage.setItem(onboardingKey, "true");
    } catch {
      // Storage can be unavailable in strict browser modes; closing should still work.
    }
    setIsOpen(false);
  };

  const finishAndNavigate = () => {
    completeOnboarding();
    router.push(content.ctaRoute);
  };

  if (!isOpen) return null;

  const isLastStep = step === 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
      <div className="console-panel w-full max-w-[620px] overflow-hidden shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === step
                    ? "w-8 bg-[var(--accent)]"
                    : index < step
                      ? "w-2 bg-[var(--green)]"
                      : "w-2 bg-[var(--border-h)]"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={completeOnboarding}>
              Skip
            </Button>
            <button
              type="button"
              aria-label="Close onboarding"
              onClick={completeOnboarding}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] text-lg leading-none text-[var(--muted)] transition hover:border-[var(--border-h)] hover:text-white"
            >
              x
            </button>
          </div>
        </div>

        <div className="min-h-[340px] px-5 py-6 transition-all duration-300 sm:px-7">
          {step === 0 && (
            <section className="flex min-h-[292px] flex-col justify-center">
              <p className="mono mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--accent)]">
                Step 1 of 3
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {content.welcomeTitle}
              </h2>
              <p className="mt-3 max-w-[480px] text-sm leading-6 text-[var(--text-muted)]">
                {content.welcomeSubtitle}
              </p>
            </section>
          )}

          {step === 1 && (
            <section className="animate-[fadeIn_0.25s_ease-out]">
              <p className="mono mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--accent)]">
                Step 2 of 3
              </p>
              <h2 className="text-xl font-bold text-white">What you can do</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {content.features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(255,255,255,0.025)] p-4 transition hover:border-[var(--border-h)]"
                  >
                    <div className="mb-3 h-1.5 w-8 rounded-full bg-[var(--green)]" />
                    <p className="text-sm font-semibold text-white">{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="flex min-h-[292px] flex-col justify-center">
              <p className="mono mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--accent)]">
                Step 3 of 3
              </p>
              <h2 className="text-xl font-bold text-white">Quick start</h2>
              <p className="mt-3 max-w-[480px] text-sm leading-6 text-[var(--text-muted)]">
                {content.quickStart}
              </p>
              <Button onClick={finishAndNavigate} className="mt-6 w-full sm:w-fit">
                {content.cta}
              </Button>
            </section>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4">
          <Button
            variant="secondary"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            onClick={() =>
              isLastStep ? completeOnboarding() : setStep((current) => current + 1)
            }
          >
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
