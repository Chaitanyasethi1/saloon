"use client";

import React from "react";
import { Search, Sparkles, Ticket, Armchair, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Discover Your Atelier",
      desc: "Browse verified high-end salons, check real-time wait times, stylist specialties, and chair availability.",
      icon: Search,
      highlight: "Filter by live wait length",
    },
    {
      num: "02",
      title: "Curate Services & Stylist",
      desc: "Select haircuts, color, or spa therapies. Total duration and pricing calculate seamlessly with optional stylist preference.",
      icon: Sparkles,
      highlight: "Auto duration tally",
    },
    {
      num: "03",
      title: "Receive Boarding Pass Token",
      desc: "Instant sequential token generated with unique QR code. Save to your wallet or track on mobile.",
      icon: Ticket,
      highlight: "Atomic sequential #",
    },
    {
      num: "04",
      title: "Arrive Right On Time",
      desc: "Relax at your home or coffee lounge. Real-time notifications alert you when 2 people are ahead and your chair is prepped.",
      icon: Armchair,
      highlight: "Zero waiting room crowding",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0A0A0B] relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-radial pointer-events-none opacity-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <span>Seamless Flow</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            How QueueWise Works
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 font-light">
            Four elegant steps designed to eliminate wasted waiting time completely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 hover:border-gold-400/30 transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Step Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-300 group-hover:scale-110 group-hover:bg-gold-400/20 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-white/10 group-hover:text-gold-400/20 transition-colors">
                    {s.num}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-gold-200 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                  {s.desc}
                </p>

                <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-gold-300/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  <span>{s.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

