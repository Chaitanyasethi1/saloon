"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, Ticket, RefreshCw, Scissors } from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";

export default function OfflineFallbackPage() {
  const { tokens } = useQueueWiseStore();
  const latestToken = tokens[tokens.length - 1];

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#0A0A0B] text-center">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-300">
          <WifiOff className="w-7 h-7" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold-300 block mb-1">
            Offline Mode Active
          </span>
          <h1 className="font-serif text-2xl font-bold text-white">You're Currently Offline</h1>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Don't worry — your digital token ticket remains cached on this device and can still be scanned by the salon concierge.
          </p>
        </div>

        {latestToken && (
          <div className="p-4 rounded-2xl glass-panel-gold border border-gold-400/30 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Last Cached Ticket</span>
              <span className="font-mono text-sm font-bold text-gold-300">#{latestToken.tokenNo}</span>
            </div>
            <p className="text-xs font-semibold text-white">{latestToken.customerName}</p>
            <p className="text-[11px] text-zinc-400">{latestToken.services?.[0]?.serviceName || "Treatment"}</p>
            <Link
              href={`/token/${latestToken.id}`}
              className="mt-3 block text-center py-2 rounded-xl bg-gold-400 text-black text-xs font-bold"
            >
              Open Offline Boarding Pass
            </Link>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Check Connection Again</span>
        </button>
      </div>
    </div>
  );
}

