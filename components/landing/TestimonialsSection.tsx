"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Tarun Tahiliani",
      role: "Fashion Designer & Patron",
      salon: "L'Étoile Atelier, Mumbai",
      quote:
        "QueueWise is the gold standard of salon bookings. I walk in directly from a shoot, sit in the velvet chair within 120 seconds, and leave looking impeccably styled. No chaos.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
    },
    {
      name: "Natasha Poonawalla",
      role: "Client & Creative Director",
      salon: "Maison de Glamour, Delhi",
      quote:
        "The digital boarding-pass ticket is brilliant. Knowing exactly which stylist is prepping my station makes the entire salon ritual feel like a private lounge experience.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
    },
    {
      name: "Vikramaditya Roy",
      role: "Proprietor, Obsidian Parlour",
      salon: "Connaught Place, Delhi",
      quote:
        "Our front desk was previously flooded with phone queries and walk-in chaos. With QueueWise TV Kiosk and 1-tap Call Next, we increased chair turnover by 34% in one month.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-[#0A0A0B] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <span>Client Praise</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Adored by Clients & Curators
          </h2>
          <p className="text-sm text-zinc-400 mt-2 font-light">
            Read authentic words from guests and master stylists across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl glass-panel p-7 sm:p-8 border border-white/10 hover:border-gold-400/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400" />
                  ))}
                </div>
                <p className="font-serif text-base text-zinc-200 leading-relaxed italic">
                  “{t.quote}”
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-gold-400/30"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                  <p className="text-[11px] text-gold-300/80">{t.role}</p>
                  <p className="text-[10px] text-zinc-500">{t.salon}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

