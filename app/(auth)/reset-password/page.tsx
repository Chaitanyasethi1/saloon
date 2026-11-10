"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2, Scissors } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    }, 700);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#0A0A0B]">
      <div className="w-full max-w-md rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mx-auto text-gold-300 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Choose New Password</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Ensure your new passkey meets the 8-character security minimum.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 mb-1.5 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-400"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

