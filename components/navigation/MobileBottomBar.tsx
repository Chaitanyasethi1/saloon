"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Ticket, User, Store } from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { currentUser } = useQueueWiseStore();

  if (pathname.startsWith("/display/")) {
    return null;
  }

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    switch (currentUser.role) {
      case "salon_owner":
        return "/dashboard/owner";
      case "staff":
        return "/dashboard/staff";
      case "super_admin":
        return "/dashboard/admin";
      default:
        return "/dashboard/customer";
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0B]/90 backdrop-blur-2xl border-t border-white/[0.08] px-3 py-2">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            pathname === "/" ? "text-gold-300" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          href="/#salons"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            pathname.includes("/salon") ? "text-gold-300" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Salons</span>
        </Link>

        <Link
          href="/dashboard/customer"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            pathname === "/dashboard/customer" || pathname.startsWith("/token/")
              ? "text-gold-300"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <div className="relative">
            <Ticket className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-medium">Tokens</span>
        </Link>

        {currentUser?.role === "salon_owner" ? (
          <Link
            href="/dashboard/owner"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              pathname.startsWith("/dashboard/owner")
                ? "text-gold-300"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] font-medium">Queue</span>
          </Link>
        ) : (
          <Link
            href={getDashboardPath()}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              pathname.startsWith("/dashboard")
                ? "text-gold-300"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        )}
      </div>
    </div>
  );
}

