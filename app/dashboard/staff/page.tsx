"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Armchair,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  User,
  Star,
  Calendar,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { formatCurrency, formatDuration, getStatusBadge } from "@/lib/utils";
import { toast } from "sonner";

export default function StaffDashboard() {
  const { salons, tokens, updateTokenStatus, currentUser } = useQueueWiseStore();
  const salon = salons[0];
  const staffTokens = tokens.filter((t) => t.salonId === salon.id);

  // Active customer in chair
  const currentCustomer = staffTokens.find((t) => t.status === "in_service");
  const nextInLine = staffTokens.filter((t) => t.status === "checked_in" || t.status === "booked");

  const [serviceTimerSec, setServiceTimerSec] = useState(24 * 60); // 24 mins into service

  const handleFinishService = (tokenId: string) => {
    updateTokenStatus(tokenId, "completed");
    toast.success("Service marked completed! Station is sanitized for next client.");
  };

  const handleStartService = (tokenId: string) => {
    updateTokenStatus(tokenId, "in_service");
    toast.success("Customer seated! Service timer running.");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0A0B] px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"}
                alt="Stylist"
                className="w-16 h-16 rounded-2xl object-cover border border-emerald-400/40"
              />
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                  Station 01 Active
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  Rohan Varma (Creative Hair Director)
                </h1>
                <p className="text-xs text-zinc-400">
                  {salon.name} • 4.95 Rating • 8 Appointments Today
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-right sm:text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Today's Chair Earnings</span>
              <span className="font-mono text-xl font-bold text-gold-300">₹8,450</span>
            </div>
          </div>
        </div>

        {/* CURRENT SEATED CUSTOMER CARD */}
        {currentCustomer ? (
          <div className="rounded-3xl glass-panel-gold p-6 sm:p-8 border border-gold-400/30 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>CURRENTLY IN YOUR CHAIR</span>
              </div>
              <span className="text-xs font-mono text-gold-300">
                Duration: {formatDuration(currentCustomer.services?.[0]?.durationMin || 45)}
              </span>
            </div>

            <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-5xl font-black text-white">
                  #{currentCustomer.tokenNo}
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">
                  {currentCustomer.customerName}
                </h2>
                <p className="text-xs text-gold-300/80 font-mono">
                  {currentCustomer.services?.[0]?.serviceName}
                </p>
                {currentCustomer.notes && (
                  <p className="text-xs text-zinc-400 mt-2 italic">
                    Note: “{currentCustomer.notes}”
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleFinishService(currentCustomer.id)}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 shadow-gold-glow flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Finish Service</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl glass-panel text-center border border-white/10">
            <Armchair className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-white">Your Chair is Currently Free</h3>
            <p className="text-xs text-zinc-400 mt-1">Check the upcoming queue below to seat the next guest.</p>
          </div>
        )}

        {/* UPCOMING QUEUE FOR THIS CHAIR */}
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">Upcoming In Line</h3>
          <div className="space-y-3">
            {nextInLine.map((t) => {
              const badge = getStatusBadge(t.status);
              return (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xl font-bold text-gold-300">
                      #{t.tokenNo}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.customerName}</p>
                      <p className="text-xs text-zinc-400">
                        {t.services?.[0]?.serviceName} • Slot: {t.slotStart}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {!currentCustomer && (
                      <button
                        onClick={() => handleStartService(t.id)}
                        className="px-4 py-2 rounded-xl bg-gold-400 text-black text-xs font-bold"
                      >
                        Seat Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

