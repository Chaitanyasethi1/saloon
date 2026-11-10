"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#0A0A0B] text-center">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-red-400 block mb-1">
            System Notice
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">Something went off-cue</h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Our atelier encountered an unexpected condition. Please try refreshing your session.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 shadow-gold-glow flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

