"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  Tv,
  CheckCircle2,
  TrendingUp,
  Radio,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function ForOwnersSection() {
  const features = [
    {
      title: "1-Tap 'Call Next' Console",
      desc: "Advance customers instantly from your phone or tablet. Auto-recalculates wait times across all chairs.",
    },
    {
      title: "Walk-in & Priority Tokens",
      desc: "Seamlessly inject physical walk-ins or VIP clients into the queue without breaking scheduling harmony.",
    },
    {
      title: "Luxe TV Waiting Room Kiosk",
      desc: "Plug any smart TV via HDMI or browser. Features voice audio chimes, 'Now Serving' tickers, and custom brand promo video.",
    },
    {
      title: "Detailed Reports & CSV Exports",
      desc: "Track daily revenue, stylist utilization, chair turnover, and customer retention metrics effortlessly.",
    },
  ];

  return (
    <section id="owners" className="py-24 bg-[#0A0A0B] relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-radial pointer-events-none opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Feature List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest">
              <Store className="w-3.5 h-3.5" />
              <span>For Modern Salon Proprietors</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Transform Your Waiting Room into an{" "}
              <span className="gold-text-gradient italic">Effortless Sanctuary</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Say goodbye to messy clipboards, noisy phone check-ins, and disgruntled waiting clients. QueueWise gives your staff complete queue command in one tap.
            </p>

            <div className="space-y-4 pt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-300 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed font-light">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/register?role=owner"
                className="px-7 py-3.5 rounded-full font-bold text-sm text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center gap-2"
              >
                <span>List My Salon Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/owner"
                className="px-6 py-3.5 rounded-full font-semibold text-sm text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
              >
                Explore Owner Demo
              </Link>
            </div>
          </div>

          {/* Right Live Console Mockup */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl glass-panel-gold p-6 sm:p-8 border border-gold-400/30 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-zinc-400 ml-2">QueueWise Owner Console v2.0</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  LIVE SYNC ACTIVE
                </span>
              </div>

              {/* Console Body Mockup */}
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                      Current In-Chair Service
                    </span>
                    <h4 className="font-serif text-lg font-bold text-white">
                      Token #12 — Devansh Mehta
                    </h4>
                    <p className="text-xs text-gold-300/80">Imperial Beard Sculpt • Chair 01 (Rohan V.)</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-gold-400/20 text-gold-200 border border-gold-400/30 text-xs font-mono font-bold hover:bg-gold-400/30 transition-colors">
                    Mark Done
                  </button>
                </div>

                {/* Next up row */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-400/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-black text-gold-300">#14</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Ananya Sharma (Arrived)</h4>
                      <p className="text-xs text-zinc-400">Artisan Cut & Blowout • Online Reservation</p>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-300 to-amber-500 text-black text-xs font-bold shadow-gold-glow hover:scale-105 active:scale-95 transition-all">
                    Call Next →
                  </button>
                </div>

                {/* Metrics Mini-strip */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500 block">Today's Revenue</span>
                    <span className="font-mono text-sm font-bold text-white">₹42,500</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500 block">Tokens Served</span>
                    <span className="font-mono text-sm font-bold text-white">28 Clients</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500 block">Avg Chair Turn</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">32 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

