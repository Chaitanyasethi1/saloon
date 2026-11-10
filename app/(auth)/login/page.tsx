"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { toast } from "sonner";
import { DEMO_USERS } from "@/lib/seed/data";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useQueueWiseStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error("Please fill in your credentials.");
      return;
    }

    if (failedAttempts >= 5) {
      toast.error("Account locked for 15 minutes due to too many failed attempts.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Find matching user by email OR username OR phone
      const cleanIdent = identifier.trim().toLowerCase();
      const user = DEMO_USERS.find(
        (u) =>
          u.email.toLowerCase() === cleanIdent ||
          u.username.toLowerCase() === cleanIdent ||
          (u.phone && u.phone.replace(/[\s+-]/g, "") === cleanIdent.replace(/[\s+-]/g, ""))
      );

      if (user) {
        setCurrentUser(user);
        toast.success(`Welcome back, ${user.fullName}!`);
        setLoading(false);

        if (user.role === "salon_owner") router.push("/dashboard/owner");
        else if (user.role === "super_admin") router.push("/dashboard/admin");
        else if (user.role === "staff") router.push("/dashboard/staff");
        else router.push("/dashboard/customer");
      } else {
        setFailedAttempts((prev) => prev + 1);
        setLoading(false);
        toast.error("Invalid credentials.", {
          description: `Failed attempt ${failedAttempts + 1} of 5. Try the demo quick-fill buttons below.`,
        });
      }
    }, 600);
  };

  const handleFillDemo = (email: string) => {
    const user = DEMO_USERS.find((u) => u.email === email);
    if (user) {
      setIdentifier(user.email);
      setPassword(user.role === "super_admin" ? "Admin@123" : "Password@123");
      toast.info(`Filled demo account: ${user.fullName}`);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
        {/* Left Side: Cinematic Branding & Imagery */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#141418] to-[#0A0A0B] border-r border-white/10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent" />

          {/* Top Brand Quote */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-gold-300" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-wider">
                QueueWise
              </span>
            </div>
            <p className="font-serif text-3xl font-light leading-snug text-white/95">
              “Precision in every scissor snip. <br />
              <span className="gold-text-gradient font-normal italic">
                Punctuality in every turn.”
              </span>
            </p>
          </div>

          {/* Bottom Live Feature Callout */}
          <div className="relative z-10 glass-panel-gold p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-gold-200 uppercase tracking-widest font-mono">
                Real-Time Queue Engine
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Arrive right as your chair opens. Zero waiting room crowding. Boarding-pass tickets with dynamic recalculation.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#111114]/90 backdrop-blur-2xl">
          <div className="mb-6">
            <h2 className="font-serif text-3xl font-bold text-white">Sign In</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Enter your email, username, or phone number to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                Email, User ID or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@domain.com or @username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gold-300 hover:text-gold-200 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                1-Click Demo Accounts
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo("customer@demo.com")}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors"
              >
                <p className="font-semibold text-white">Customer</p>
                <p className="text-[10px] text-zinc-400">customer@demo.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("owner@demo.com")}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors"
              >
                <p className="font-semibold text-amber-300">Salon Owner</p>
                <p className="text-[10px] text-zinc-400">owner@demo.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("staff@demo.com")}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors"
              >
                <p className="font-semibold text-emerald-300">Staff Stylist</p>
                <p className="text-[10px] text-zinc-400">staff@demo.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("admin@queuewise.app")}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-left transition-colors"
              >
                <p className="font-semibold text-purple-300">Super Admin</p>
                <p className="text-[10px] text-zinc-400">admin@queuewise.app</p>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-6">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-gold-300 hover:text-gold-200 font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

