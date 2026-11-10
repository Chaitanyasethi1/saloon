"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Ticket,
  Store,
  User,
  ChevronDown,
  LogOut,
  ShieldAlert,
  Tv,
  Scissors,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout, salons } = useQueueWiseStore();

  const activeSalon = salons[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!currentUser) return "/login";
    switch (currentUser.role) {
      case "super_admin":
        return "/dashboard/admin";
      case "salon_owner":
        return "/dashboard/owner";
      case "staff":
        return "/dashboard/staff";
      default:
        return "/dashboard/customer";
    }
  };

  // Hide default navbar on full-screen TV display page
  if (pathname.startsWith("/display/")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/[0.07] py-3.5 shadow-2xl"
          : "bg-gradient-to-b from-[#0A0A0B]/90 via-[#0A0A0B]/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-300 via-gold-500 to-amber-700 flex items-center justify-center p-[1px] shadow-gold-glow">
              <div className="w-full h-full bg-[#0A0A0B] rounded-[11px] flex items-center justify-center transition-colors group-hover:bg-transparent">
                <Scissors className="w-5 h-5 text-gold-300 group-hover:text-black transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-gold-200 transition-colors">
                  QueueWise
                </span>
                <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-gold-400/10 text-gold-300 border border-gold-400/20 font-mono">
                  Luxe
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest -mt-1 hidden sm:block">
                Skip the Wait • Live Tokens
              </p>
            </div>
          </Link>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#salons"
              className="text-sm font-medium text-zinc-300 hover:text-gold-300 transition-colors"
            >
              Find Salons
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-zinc-300 hover:text-gold-300 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#owners"
              className="text-sm font-medium text-zinc-300 hover:text-gold-300 transition-colors"
            >
              For Salon Owners
            </Link>
            <Link
              href={`/display/${activeSalon?.slug || "letoile-atelier-mumbai"}`}
              target="_blank"
              className="text-xs font-medium text-gold-300/80 hover:text-gold-200 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 transition-all hover:bg-gold-500/20"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV Kiosk Display</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-100 hover:bg-surface-50 border border-white/10 transition-colors text-sm"
                >
                  <img
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-gold-400/30"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {currentUser.fullName.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-gold-300/80 uppercase font-mono">
                      {currentUser.role.replace("_", " ")}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 text-sm z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-medium text-zinc-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {currentUser.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gold-500/15 text-gold-300 border border-gold-500/30">
                        {currentUser.role.replace("_", " ")}
                      </span>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-white/5 hover:text-gold-200 transition-colors"
                    >
                      <User className="w-4 h-4 text-gold-300" />
                      <span>My Dashboard</span>
                    </Link>

                    {currentUser.role === "salon_owner" && (
                      <Link
                        href="/dashboard/owner"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-white/5 hover:text-gold-200 transition-colors"
                      >
                        <Store className="w-4 h-4 text-gold-300" />
                        <span>Live Queue Console</span>
                      </Link>
                    )}

                    {currentUser.role === "super_admin" && (
                      <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-white/5 hover:text-gold-200 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-gold-300" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <Link
                      href="/dashboard/customer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-200 hover:bg-white/5 hover:text-gold-200 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-gold-300" />
                      <span>My Live Tokens</span>
                    </Link>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left mt-1 border-t border-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Quick Action CTA */}
            <Link
              href="/#salons"
              className="relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full font-medium text-xs shadow-gold-glow hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="w-full h-full bg-gradient-to-r from-gold-300 via-gold-400 to-amber-600 absolute"></span>
              <span className="relative px-4 py-2 transition-all ease-out bg-[#0A0A0B] rounded-full group-hover:bg-opacity-0">
                <span className="relative text-gold-200 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                  <span>Book Token</span>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

