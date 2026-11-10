"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the live token estimation work?",
      a: "QueueWise calculates wait times dynamically by summing up the exact durations of services chosen by guests ahead of you, divided across the salon's active stylist chairs. If a service finishes early or takes extra time, the estimated wait updates immediately without requiring a page refresh.",
    },
    {
      q: "Can I cancel or reschedule my token ticket?",
      a: "Yes. Customers can cancel or reschedule their token directly from their Live Token Tracking screen up to 30 minutes before their estimated slot time without any cancellation penalty.",
    },
    {
      q: "Do I need to download a mobile app to book or track?",
      a: "Not at all. QueueWise is built as a lightning-fast Progressive Web App (PWA). You can open it in Safari or Chrome, save the boarding pass to your home screen or digital wallet, and receive real-time notifications directly in your browser.",
    },
    {
      q: "What happens if I arrive 10 minutes late for my turn?",
      a: "Each salon configures a gracious 10–15 minute holding period. If you are delayed, the owner console allows the front desk to move your token to 'Skipped' or push it back by 2 chairs rather than outright cancelling it.",
    },
    {
      q: "How do salon owners set up the TV Waiting Room Display?",
      a: "Simply open your unique salon display URL (e.g. /display/letoile-atelier-mumbai) on any smart TV or tablet browser. It provides an immersive cinematic dark layout with automated voice announcements and audio chimes whenever 'Call Next' is tapped.",
    },
  ];

  return (
    <section className="py-24 bg-[#0A0A0B] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clarity & Answers</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-400 mt-2 font-light">
            Everything you need to know about tokens, wait times, and owner displays.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-white">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold-300 transition-transform ${
                      isOpen ? "rotate-180 bg-gold-400/20 text-gold-200" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5 font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

