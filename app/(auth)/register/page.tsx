"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scissors,
  User,
  Store,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { toast } from "sonner";
import { UserRole } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useQueueWiseStore();

  const [role, setRole] = useState<UserRole>("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [salonName, setSalonName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newUser = {
        id: `user-${Date.now()}`,
        role,
        fullName,
        username: email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "_"),
        email,
        phone,
        status: "active" as const,
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(newUser);
      setLoading(false);

      if (role === "salon_owner") {
        toast.success("Salon account created!", {
          description: "Let's set up your chairs, services, and live queue.",
        });
        router.push("/dashboard/owner");
      } else {
        toast.success("Account created successfully!", {
          description: "Welcome to QueueWise. Find your first salon.",
        });
        router.push("/dashboard/customer");
      }
    }, 700);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl p-8 sm:p-12">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Scissors className="w-3.5 h-3.5" />
              <span>Join QueueWise Luxe</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Create Your Account
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Choose your profile type to customize your live queue experience.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-8 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all ${
                role === "customer"
                  ? "bg-gradient-to-r from-gold-400/20 to-gold-500/20 text-gold-200 border border-gold-400/30 shadow-gold-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <User className="w-4 h-4 text-gold-300" />
              <span>I'm a Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("salon_owner")}
              className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all ${
                role === "salon_owner"
                  ? "bg-gradient-to-r from-gold-400/20 to-gold-500/20 text-gold-200 border border-gold-400/30 shadow-gold-glow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Store className="w-4 h-4 text-gold-300" />
              <span>I Own a Salon</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Radhika Kapoor"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                required
              />
            </div>

            {role === "salon_owner" && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Salon Brand Name
                </label>
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="e.g. Atelier Noir Coiffure"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                  required={role === "salon_owner"}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                  required
                />
              </div>

              {/* Strength meter bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`flex-1 rounded-full transition-all ${
                          strength >= lvl
                            ? strength <= 2
                              ? "bg-red-400"
                              : strength <= 3
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {strength <= 2 && "Weak password"}
                    {strength === 3 && "Medium strength password"}
                    {strength >= 4 && "Strong luxury security passkey"}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{role === "salon_owner" ? "Create Owner Account" : "Join as Customer"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-300 hover:text-gold-200 font-medium">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

