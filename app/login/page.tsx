import type { Metadata } from "next";
import { Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | Productivity Hub",
  description: "Sign in to your personal productivity hub",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl"
        style={{
          background: "rgba(15,23,42,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 0 30px rgba(99,102,241,0.5)",
            }}
          >
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#e2e8f0" }}>
            Productivity Hub
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.7)" }}>
            Your personal knowledge base
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
