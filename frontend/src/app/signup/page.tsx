import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-page)] p-4">
      <div className="pointer-events-none absolute left-1/2 top-[30%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,142,255,0.07)_0%,transparent_70%)]" />
      <AuthForm mode="signup" />
    </div>
  );
}
