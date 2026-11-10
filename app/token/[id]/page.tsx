"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Clock,
  Users,
  Armchair,
  CheckCircle2,
  Calendar,
  MapPin,
  Share2,
  Download,
  AlertTriangle,
  ArrowLeft,
  Flame,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { getStatusBadge, formatCurrency, formatDuration } from "@/lib/utils";
import { toast } from "sonner";

export default function TokenLiveTrackingPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { getTokenById, updateTokenStatus, salons } = useQueueWiseStore();
  const token = getTokenById(id);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen pt-32 text-center text-white px-4">
        <h1 className="font-serif text-3xl font-bold mb-2">Token Ticket Not Found</h1>
        <p className="text-zinc-400 text-sm mb-6">
          This token identifier does not exist or has expired.
        </p>
        <Link
          href="/dashboard/customer"
          className="px-6 py-2.5 rounded-full bg-gold-400 text-black text-xs font-bold"
        >
          View My Tokens
        </Link>
      </div>
    );
  }

  const salon = token.salon || salons.find((s) => s.id === token.salonId);
  const statusBadge = getStatusBadge(token.status);

  // Calculate live people ahead
  const isCurrentlyInService = token.status === "in_service";
  const isCompleted = token.status === "completed";
  const isCancelled = token.status === "cancelled";

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this token ticket?")) {
      setCancelling(true);
      setTimeout(() => {
        updateTokenStatus(token.id, "cancelled");
        toast.info("Token cancelled successfully.");
        setCancelling(false);
      }, 500);
    }
  };

  const handleCheckIn = () => {
    updateTokenStatus(token.id, "checked_in");
    toast.success("Checked in! The front desk and stylists have been notified.");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `QueueWise Token #${token.tokenNo}`,
        text: `My live token #${token.tokenNo} at ${salon?.name}. Live tracking:`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Live ticket link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0A0B] px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/customer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Tokens</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
              title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-gold-300" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
              title="Share Live Ticket"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Status Alert Banner */}
        {isCurrentlyInService ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-pulse">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider font-mono">It's Your Turn Now!</p>
              <p className="text-xs text-emerald-200">Please proceed directly to Chair 01.</p>
            </div>
          </div>
        ) : token.status === "checked_in" ? (
          <div className="p-4 rounded-2xl bg-gold-500/15 border border-gold-400/30 text-gold-200 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-gold-400 animate-ping" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider font-mono">Checked In At Reception</p>
              <p className="text-xs text-zinc-300">Relax in the lounge. You will be seated momentarily.</p>
            </div>
          </div>
        ) : null}

        {/* LUXURY BOARDING PASS TICKET CARD */}
        <div className="relative rounded-3xl overflow-hidden glass-panel-gold border border-gold-400/30 shadow-2xl ticket-notch-left">
          {/* Header Part */}
          <div className="p-6 sm:p-8 border-b border-dashed border-white/15">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  Bespoke Salon
                </span>
                <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                  {salon?.name || "QueueWise Atelier"}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{salon?.address}, {salon?.city}</span>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border flex items-center gap-1.5 ${statusBadge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                <span>{statusBadge.label}</span>
              </span>
            </div>

            {/* Giant Token Number Centerpiece */}
            <div className="mt-8 mb-4 text-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                Your Priority Token
              </span>
              <div className="font-mono text-6xl sm:text-7xl font-black gold-text-gradient tracking-tight my-1">
                #{token.tokenNo}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-white/5 px-3 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{token.type} Reservation</span>
                <span>•</span>
                <span>Slot: {token.slotStart || "14:00"}</span>
              </div>
            </div>

            {/* Real-time Metrics 3-Col Bar */}
            <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Est. Wait
                </span>
                <span className="font-mono text-xl font-bold text-white">
                  {isCurrentlyInService ? "0m" : `~${token.estWaitMin}m`}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  People Ahead
                </span>
                <span className="font-mono text-xl font-bold text-white">
                  {isCurrentlyInService ? "0" : "1 guest"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Now Serving
                </span>
                <span className="font-mono text-xl font-bold text-emerald-400">
                  #{salon?.nowServingTokenNo || 12}
                </span>
              </div>
            </div>
          </div>

          {/* Lower Ticket Stub (QR Code & Actions) */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-[#111114] to-[#0A0A0B] flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* QR Code Container */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-white border border-gold-400/40 shadow-gold-glow flex-shrink-0">
                <QRCodeSVG
                  value={`QUEUWISE-${token.id}-${token.tokenNo}`}
                  size={100}
                  level="H"
                  fgColor="#0A0A0B"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Scan at Reception
                </p>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  Present this QR ticket upon arrival to check in automatically.
                </p>
                <p className="text-[10px] font-mono text-gold-300 pt-1">
                  ID: {token.qrCode || `QW-${token.id.slice(-6).toUpperCase()}`}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {token.status === "booked" && (
                <button
                  onClick={handleCheckIn}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow transition-all"
                >
                  I Have Arrived (Check In)
                </button>
              )}

              {token.status !== "cancelled" && token.status !== "completed" && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                >
                  Cancel Token
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selected Services Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Booked Treatments & Inclusions
          </h3>
          <div className="space-y-2">
            {token.services?.map((s) => (
              <div key={s.id} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                <div>
                  <span className="text-white font-medium">{s.serviceName}</span>
                  <span className="text-zinc-500 ml-2">({formatDuration(s.durationMin)})</span>
                </div>
                <span className="font-mono text-gold-300 font-semibold">{formatCurrency(s.price)}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-zinc-400">Guest Name:</span>
            <span className="text-white font-medium">{token.customerName}</span>
          </div>

          {token.notes && (
            <div className="pt-2 text-xs text-zinc-400 border-t border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase font-mono">Special Notes:</span>
              <p className="text-zinc-300 mt-0.5">{token.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

