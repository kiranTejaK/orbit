import type { Metadata } from "next";
import { OrbitIcon } from "@/components/shared/orbit-logo";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | Orbit",
  description: "Sign in to Orbit — Daily Planner & Productivity Suite",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #060b17 0%, #0f172a 50%, #060b17 100%)",
      }}
    >
      {/* Decorative ambient glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl z-10"
        style={{
          background: "rgba(15,23,42,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Orbit Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-3">
            <OrbitIcon size={48} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Orbit
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PRO
            </span>
          </h1>
          <p className="text-xs mt-1.5 text-slate-400">
            Daily Planner, Knowledge Base & Career Hub
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
