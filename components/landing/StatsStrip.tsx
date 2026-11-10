"use client";

import React from "react";
import { Zap, Radio, DownloadCloud, Award } from "lucide-react";

export default function StatsStrip() {
  const stats = [
    {
      label: "Average Booking Time",
      value: "30 sec",
      subtext: "Instant confirmation",
      icon: Zap,
    },
    {
      label: "Zero App Download",
      value: "0 MB",
      subtext: "Book straight in browser",
      icon: DownloadCloud,
    },
    {
      label: "Live Token Accuracy",
      value: "99.8%",
      subtext: "Continuous synchronization",
      icon: Radio,
    },
    {
      label: "Client Satisfaction",
      value: "4.96 ★",
      subtext: "Across 18,000+ appointments",
      icon: Award,
    },
  ];

  return (
    <section className="border-y border-white/[0.08] bg-[#0E0E11]/80 backdrop-blur-md relative z-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 group p-2 rounded-2xl transition-colors hover:bg-white/[0.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-300 group-hover:scale-105 group-hover:bg-gold-400/20 transition-all flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {item.value}
                  </div>
                  <p className="text-xs font-semibold text-zinc-300 -mt-0.5">{item.label}</p>
                  <p className="text-[11px] text-zinc-500">{item.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

