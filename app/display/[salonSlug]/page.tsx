"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Armchair,
  Clock,
  Scissors,
  CheckCircle2,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { formatCurrency } from "@/lib/utils";

export default function TvDisplayPage() {
  const params = useParams();
  const slug = params?.salonSlug as string;

  const { getSalonBySlug, getSalonTokens, lastCalledToken } = useQueueWiseStore();
  const salon = getSalonBySlug(slug);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Audio Chime & Text-to-Speech synthesis when token is called
  useEffect(() => {
    if (!lastCalledToken || !soundEnabled) return;

    try {
      // Synthesize elegant voice announcement
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const text = `Token number ${lastCalledToken.tokenNo}, please proceed to Chair one for ${lastCalledToken.customerName}.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis trigger failed", e);
    }
  }, [lastCalledToken, soundEnabled]);

  const tokens = salon ? getSalonTokens(salon.id) : [];
  const inServiceTokens = tokens.filter((t) => t.status === "in_service");
  const upcomingTokens = tokens.filter(
    (t) => t.status === "booked" || t.status === "checked_in"
  ).slice(0, 5);

  const nowServing = inServiceTokens[0] || (tokens.length > 0 ? tokens[0] : null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] text-white overflow-hidden flex flex-col z-50 selection:bg-transparent">
      {/* Top Header Kiosk Strip */}
      <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-[#111114]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-gold-300" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              {salon?.name || "QueueWise Haute Atelier"}
            </h1>
            <p className="text-xs text-gold-300/80 font-mono uppercase tracking-widest -mt-0.5">
              Live Lounge Waiting Room Display
            </p>
          </div>
        </div>

        {/* Center Live Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>REAL-TIME QUEUE SYNC</span>
        </div>

        {/* Right Clock & Controls */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xl font-bold text-zinc-200 tracking-wider">
            {currentTime}
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
            title={soundEnabled ? "Mute audio announcer" : "Enable audio announcer"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-gold-300" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
            title="Fullscreen Mode"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Kiosk Split Screen */}
      <div className="flex-1 grid grid-cols-12 gap-8 p-8 overflow-hidden">
        {/* Left Column: Huge "Now Serving" Card */}
        <div className="col-span-7 flex flex-col justify-between rounded-3xl glass-panel-gold border border-gold-400/30 p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 text-9xl font-mono font-black text-white/[0.02] select-none pointer-events-none">
            NOW
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/20 border border-gold-400/30 text-gold-200 text-xs font-mono uppercase tracking-widest mb-6">
              <Armchair className="w-4 h-4 text-gold-300" />
              <span>Now Serving in Chair</span>
            </div>

            <div className="font-mono text-8xl sm:text-9xl font-black gold-text-gradient tracking-tight my-2">
              #{nowServing?.tokenNo || "14"}
            </div>

            <h2 className="font-serif text-4xl font-bold text-white mt-4">
              {nowServing?.customerName || "Ananya Sharma"}
            </h2>

            <p className="text-lg text-gold-300/90 mt-1 font-mono">
              {nowServing?.services?.[0]?.serviceName || "Artisan Haircut & Blowout"}
            </p>
          </div>

          {/* Chair & Stylist allocation box */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 mt-6">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-xs font-mono uppercase text-zinc-400 block">Assigned Station</span>
              <span className="font-mono text-2xl font-bold text-white">Velvet Chair 01</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-xs font-mono uppercase text-zinc-400 block">Master Stylist</span>
              <span className="font-mono text-2xl font-bold text-emerald-400">Rohan Varma</span>
            </div>
          </div>
        </div>

        {/* Right Column: Next 5 Up in Line & Chair Overview */}
        <div className="col-span-5 flex flex-col justify-between space-y-6">
          {/* Next Tokens Up */}
          <div className="flex-1 rounded-3xl glass-panel border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Next in Line (Please Be Ready)
                </span>
                <span className="text-xs font-mono text-gold-300">
                  {upcomingTokens.length} waiting
                </span>
              </div>

              <div className="space-y-3">
                {upcomingTokens.length > 0 ? (
                  upcomingTokens.map((t, idx) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-2xl font-extrabold text-gold-300">
                          #{t.tokenNo}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{t.customerName}</p>
                          <p className="text-[11px] text-zinc-400">
                            {t.services?.[0]?.serviceName || "Treatment"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono text-zinc-300 block">
                          ~{t.estWaitMin}m
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">
                          {t.status === "checked_in" ? "In Lounge" : "Online"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-zinc-500 text-xs">
                    All guests currently seated. Queue is clear!
                  </div>
                )}
              </div>
            </div>

            {/* Promo Marquee Offer */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-gold-500/10 via-rose-glow/10 to-transparent border border-gold-400/20">
              <span className="text-[10px] font-mono uppercase text-gold-300 font-bold block mb-1">
                Lounge Amenity & Privilege
              </span>
              <p className="text-xs text-zinc-300 leading-snug">
                Complimentary cold-pressed juices & Kyoto iced matcha available at the bar station. Connect to high-speed WiFi: <strong className="text-white">LetoileLuxe_Guest</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Announcement Ticker */}
      <div className="h-12 border-t border-white/10 bg-[#111114] px-8 flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-300" />
          <span>QueueWise Live Waiting Room Engine</span>
        </div>
        <div>
          <span>Questions? Inquire at the front concierge desk.</span>
        </div>
      </div>
    </div>
  );
}

