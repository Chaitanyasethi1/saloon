"use client";

import React from "react";
import Link from "next/link";
import { Scissors, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0A0A0B] pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-gold-300" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                QueueWise
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-light">
              Elevating the salon grooming ritual across India with intelligent real-time queue orchestration and digital boarding pass tickets.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-zinc-500 font-mono">
              <span>Mumbai</span> • <span>Delhi NCR</span> • <span>Bangalore</span> • <span>Goa</span>
            </div>
          </div>

          {/* Nav column 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/#salons" className="hover:text-gold-300 transition-colors">
                  Find Salons
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-gold-300 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#salons" className="hover:text-gold-300 transition-colors">
                  Popular Services
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-gold-300 transition-colors">
                  My Live Tokens
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav column 2 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Proprietors
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/register?role=owner" className="hover:text-gold-300 transition-colors">
                  List Your Salon
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner" className="hover:text-gold-300 transition-colors">
                  Live Queue Console
                </Link>
              </li>
              <li>
                <Link href="/display/letoile-atelier-mumbai" target="_blank" className="hover:text-gold-300 transition-colors">
                  TV Kiosk Display
                </Link>
              </li>
              <li>
                <Link href="/dashboard/staff" className="hover:text-gold-300 transition-colors">
                  Staff Chair Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav column 3: Demo Logins */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Demo Access
            </h4>
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between items-center">
                <span>Customer</span>
                <span className="font-mono text-zinc-300">customer@demo.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Owner</span>
                <span className="font-mono text-amber-300">owner@demo.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Admin</span>
                <span className="font-mono text-purple-300">admin@queuewise.app</span>
              </div>
              <p className="text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                Pass: <code className="text-zinc-300">Password@123</code> / <code className="text-zinc-300">Admin@123</code>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 QueueWise Haute Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Engineered with passion for bespoke grooming</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

