import React from "react";
import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#0A0A0B] text-center">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-300">
          <Scissors className="w-7 h-7" />
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold-300 block mb-1">
            404 — Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-white">Lost in the Lounge?</h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            The page or token ticket you are seeking does not exist or has been relocated to another styling suite.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 shadow-gold-glow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to QueueWise Home</span>
        </Link>
      </div>
    </div>
  );
}

