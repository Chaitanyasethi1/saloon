"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  Armchair,
  CheckCircle2,
  TrendingUp,
  Flame,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";

export default function HeroSection() {
  const { salons, tokens } = useQueueWiseStore();
  const featuredSalon = salons[0];

  // Simulating live ticking queue card
  const [liveTokenNo, setLiveTokenNo] = useState(14);
  const [peopleAhead, setPeopleAhead] = useState(2);
  const [estWait, setEstWait] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      // Dynamic micro-shifts to feel like real time
      setEstWait((prev) => (prev > 5 ? prev - 1 : 14));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-noise">
      {/* Background cinematic imagery with moody dark gradient overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform -translate-y-6"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/85 via-[#0A0A0B]/70 to-[#0A0A0B]" />
      <div className="absolute inset-0 bg-dark-radial pointer-events-none" />

      {/* Floating Gold Flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-400/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Big Typographic Headline & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span>India's Premier Live Salon Queue</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Book your turn. <br />
              <span className="gold-text-gradient font-normal italic">
                Skip the wait.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-300 font-light max-w-xl leading-relaxed">
              Never sit idly in a crowded waiting lounge again. Reserve bespoke salon services, track your live token ticket in real time, and walk in right as your chair is ready.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#salons"
                className="group px-7 py-3.5 rounded-full font-semibold text-sm text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Book a Token</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/register?role=owner"
                className="px-6 py-3.5 rounded-full font-medium text-sm text-zinc-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-gold-400/40 transition-all backdrop-blur-md"
              >
                List My Salon Free
              </Link>
            </div>

            {/* Social Trust Badges */}
            <div className="pt-4 flex items-center gap-6 border-t border-white/[0.07]">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Customer avatar"
                    className="w-8 h-8 rounded-full border-2 border-[#0A0A0B] object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-gold-300">
                  {"★".repeat(5)}
                  <span className="text-xs font-bold text-white ml-1 font-mono">4.94 / 5.0</span>
                </div>
                <p className="text-[11px] text-zinc-400">Over 18,400+ clients served on time</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Cinematic Glass Live Token Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Soft gold backdrop glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/20 via-rose-glow/20 to-gold-400/10 rounded-3xl blur-xl opacity-75 animate-pulse-slow" />

              {/* The Live Boarding Pass Token Card */}
              <div className="relative glass-panel-gold rounded-3xl p-6 sm:p-7 border border-gold-400/30 shadow-2xl backdrop-blur-2xl">
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-semibold text-gold-200 tracking-wider uppercase">
                      Live Queue Feed
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Chair Ready Soon
                  </span>
                </div>

                {/* Salon Name & Tag */}
                <div className="mt-4">
                  <p className="text-xs text-zinc-400 font-medium">Bespoke Atelier</p>
                  <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                    {featuredSalon?.name || "L'Étoile Atelier de Beauté"}
                  </h3>
                  <p className="text-xs text-gold-300/80">Bandra West, Mumbai</p>
                </div>

                {/* Giant Animated Token Number */}
                <div className="my-6 p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 text-center relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 text-7xl font-mono font-black text-white/[0.03] select-none">
                    #{liveTokenNo}
                  </div>
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">
                    Your Live Token Ticket
                  </p>
                  <div className="font-mono text-5xl sm:text-6xl font-extrabold gold-text-gradient tracking-tight my-1">
                    #{liveTokenNo}
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-white/5 px-3 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Priority Online Reservation</span>
                  </div>
                </div>

                {/* Live Real-Time Queue Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pb-5 border-b border-white/10">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-center gap-1 text-zinc-400 text-[10px] uppercase font-mono mb-1">
                      <Clock className="w-3 h-3 text-gold-300" />
                      <span>Est. Wait</span>
                    </div>
                    <p className="font-mono text-lg font-bold text-white">~{estWait} min</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-center gap-1 text-zinc-400 text-[10px] uppercase font-mono mb-1">
                      <Users className="w-3 h-3 text-gold-300" />
                      <span>Ahead</span>
                    </div>
                    <p className="font-mono text-lg font-bold text-white">{peopleAhead} guests</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-center gap-1 text-zinc-400 text-[10px] uppercase font-mono mb-1">
                      <Armchair className="w-3 h-3 text-gold-300" />
                      <span>Now Serving</span>
                    </div>
                    <p className="font-mono text-lg font-bold text-emerald-400">
                      #{featuredSalon?.nowServingTokenNo || 12}
                    </p>
                  </div>
                </div>

                {/* Progress bar to chair */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Queue Progress</span>
                    <span className="text-gold-300 font-mono">75% complete</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 transition-all duration-700"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-5">
                  <Link
                    href={`/salon/${featuredSalon?.slug || "letoile-atelier-mumbai"}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 text-gold-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Salon Details & Services</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

