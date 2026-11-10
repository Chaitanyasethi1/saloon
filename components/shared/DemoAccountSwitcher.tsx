"use client";

import React, { useState } from "react";
import { UserCheck, ChevronUp, ShieldAlert, Store, Scissors, User, X } from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DemoAccountSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, switchDemoRole } = useQueueWiseStore();
  const router = useRouter();

  const handleSelectRole = (role: "customer" | "owner" | "staff" | "admin") => {
    switchDemoRole(role);
    setIsOpen(false);
    toast.success(`Switched role to: ${role.replace("_", " ").toUpperCase()}`, {
      description: "Session and access permissions updated instantly.",
    });

    if (role === "owner") router.push("/dashboard/owner");
    else if (role === "admin") router.push("/dashboard/admin");
    else if (role === "staff") router.push("/dashboard/staff");
    else router.push("/dashboard/customer");
  };

  return (
    <div className="fixed bottom-16 md:bottom-5 right-4 z-50">
      {isOpen && (
        <div className="mb-3 w-72 rounded-2xl glass-dropdown p-3 border border-gold-400/30 shadow-gold-glow animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-gold-300" />
              <span className="text-xs font-semibold text-white tracking-wide">
                Instant Demo Role Switcher
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <button
              onClick={() => handleSelectRole("customer")}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                currentUser?.role === "customer"
                  ? "bg-gold-500/20 text-gold-200 border border-gold-500/30"
                  : "hover:bg-white/5 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <div className="text-left">
                  <p className="font-medium text-white">Customer Demo</p>
                  <p className="text-[10px] text-zinc-400">customer@demo.com</p>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                Booker
              </span>
            </button>

            <button
              onClick={() => handleSelectRole("owner")}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                currentUser?.role === "salon_owner"
                  ? "bg-gold-500/20 text-gold-200 border border-gold-500/30"
                  : "hover:bg-white/5 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <div className="text-left">
                  <p className="font-medium text-white">Salon Owner</p>
                  <p className="text-[10px] text-zinc-400">owner@demo.com</p>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Live Queue
              </span>
            </button>

            <button
              onClick={() => handleSelectRole("staff")}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                currentUser?.role === "staff"
                  ? "bg-gold-500/20 text-gold-200 border border-gold-500/30"
                  : "hover:bg-white/5 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                <div className="text-left">
                  <p className="font-medium text-white">Staff / Stylist</p>
                  <p className="text-[10px] text-zinc-400">staff@demo.com</p>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Chair View
              </span>
            </button>

            <button
              onClick={() => handleSelectRole("admin")}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                currentUser?.role === "super_admin"
                  ? "bg-gold-500/20 text-gold-200 border border-gold-500/30"
                  : "hover:bg-white/5 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <div className="text-left">
                  <p className="font-medium text-white">Super Admin</p>
                  <p className="text-[10px] text-zinc-400">admin@queuewise.app</p>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Full Control
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Launcher pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-500/30 via-gold-400/20 to-surface-200 border border-gold-400/40 text-xs font-medium text-gold-200 shadow-gold-glow hover:scale-105 active:scale-95 transition-transform backdrop-blur-md"
      >
        <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
        <span className="font-mono text-[11px] font-semibold">
          Role: {currentUser ? currentUser.role.replace("_", " ") : "Guest"}
        </span>
        <ChevronUp
          className={`w-3.5 h-3.5 text-gold-300 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}

