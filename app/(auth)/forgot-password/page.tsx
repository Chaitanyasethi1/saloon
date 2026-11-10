
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("Password reset link dispatched!", {
      description: `Check your inbox at ${email} for recovery instructions.`,
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 shadow-2xl">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-gold-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto mb-4 text-gold-300">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>. Click the link to choose a new password.
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-white">Reset Password</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your registered email and we'll send you a secure verification link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
