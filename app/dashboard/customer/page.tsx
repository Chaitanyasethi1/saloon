"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Clock,
  Sparkles,
  Heart,
  Star,
  Award,
  Calendar,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { formatCurrency, formatDuration, getStatusBadge } from "@/lib/utils";
import { toast } from "sonner";

export default function CustomerDashboard() {
  const {
    currentUser,
    tokens,
    salons,
    favorites,
    toggleFavorite,
    addReview,
  } = useQueueWiseStore();

  const [activeTab, setActiveTab] = useState<"active" | "history" | "favorites" | "loyalty">("active");

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewToken, setReviewToken] = useState<any>(null);

  // Customer's tokens
  const customerTokens = tokens.filter(
    (t) => t.customerEmail === currentUser?.email || t.customerId === currentUser?.id || t.customerName.includes("Ananya")
  );

  const activeToken = customerTokens.find(
    (t) => t.status === "booked" || t.status === "checked_in" || t.status === "in_service"
  );

  const pastTokens = customerTokens.filter(
    (t) => t.status === "completed" || t.status === "cancelled" || t.status === "no_show"
  );

  const favoriteSalons = salons.filter((s) => favorites.includes(s.id));

  const handleOpenReview = (t: any) => {
    setReviewToken(t);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewToken) return;

    addReview({
      salonId: reviewToken.salonId,
      customerId: currentUser?.id || "user-customer",
      customerName: currentUser?.fullName || "Ananya Sharma",
      customerAvatar: currentUser?.avatarUrl,
      rating: reviewRating,
      comment: reviewComment,
    });

    toast.success("Thank you! Your verified review has been published.");
    setShowReviewModal(false);
    setReviewComment("");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0A0B] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Customer Welcome Header */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
                alt={currentUser?.fullName || "Guest"}
                className="w-16 h-16 rounded-2xl object-cover border border-gold-400/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Hello, {currentUser?.fullName?.split(" ")[0] || "Ananya"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-gold-400/10 text-gold-300 border border-gold-400/20">
                    VIP Patron
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Member since 2026 • 240 Loyalty Points accumulated
                </p>
              </div>
            </div>

            <Link
              href="/#salons"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow flex items-center gap-2 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book New Token</span>
            </Link>
          </div>
        </div>

        {/* ACTIVE TOKEN HERO CARD */}
        {activeToken ? (
          <div className="rounded-3xl glass-panel-gold p-6 sm:p-8 border border-gold-400/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 mb-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ACTIVE LIVE RESERVATION</span>
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {salons.find((s) => s.id === activeToken.salonId)?.name || "L'Étoile Atelier"}
                </h2>
                <p className="text-xs text-gold-300 font-mono mt-0.5">
                  Slot: {activeToken.slotStart} - {activeToken.slotEnd} • {activeToken.date}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Your Token</span>
                <span className="font-mono text-4xl sm:text-5xl font-black gold-text-gradient">
                  #{activeToken.tokenNo}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 my-6 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Est. Wait</span>
                <span className="font-mono text-xl font-bold text-white">
                  {activeToken.status === "in_service" ? "0m" : `~${activeToken.estWaitMin}m`}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Status</span>
                <span className="font-mono text-sm font-bold text-emerald-400 uppercase">
                  {activeToken.status.replace("_", " ")}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Treatment</span>
                <span className="text-xs font-semibold text-zinc-200 truncate block">
                  {activeToken.services?.[0]?.serviceName || "Bespoke Cut"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <p className="text-xs text-zinc-400">
                Show your boarding-pass QR code to the concierge upon stepping into the atelier.
              </p>
              <Link
                href={`/token/${activeToken.id}`}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 shadow-gold-glow flex items-center gap-1.5 flex-shrink-0"
              >
                <span>View Live Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl glass-panel p-8 text-center border border-white/10 space-y-3">
            <Ticket className="w-10 h-10 text-gold-300/60 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-white">No Active Tokens Right Now</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Ready for a haircut, blowout, or spa ritual? Find an open chair at premier salons.
            </p>
            <Link
              href="/#salons"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gold-400/20 text-gold-200 border border-gold-400/30 text-xs font-semibold"
            >
              <span>Explore Available Salons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-3 px-5 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "active" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>All Bookings ({customerTokens.length})</span>
            {activeTab === "active" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`py-3 px-5 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "favorites" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Saved Ateliers ({favoriteSalons.length})</span>
            {activeTab === "favorites" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("loyalty")}
            className={`py-3 px-5 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "loyalty" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Loyalty Privilege Wallet</span>
            {activeTab === "loyalty" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>
        </div>

        {/* TAB: All Tokens */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {customerTokens.map((t) => {
              const salon = salons.find((s) => s.id === t.salonId);
              const badge = getStatusBadge(t.status);
              return (
                <div
                  key={t.id}
                  className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono font-bold text-lg text-gold-300 flex-shrink-0">
                      #{t.tokenNo}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-white">{salon?.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {t.services?.[0]?.serviceName} • {t.date}
                      </p>
                      <span className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border inline-flex items-center gap-1 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.status === "completed" && (
                      <button
                        onClick={() => handleOpenReview(t)}
                        className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gold-300 font-semibold"
                      >
                        Rate & Review
                      </button>
                    )}

                    <Link
                      href={`/token/${t.id}`}
                      className="px-4 py-2 rounded-xl bg-gold-400/20 text-gold-200 border border-gold-400/30 text-xs font-semibold"
                    >
                      Ticket
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Favorites */}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteSalons.map((s) => (
              <div key={s.id} className="rounded-2xl glass-panel p-5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-white">{s.name}</h4>
                  <p className="text-xs text-zinc-400">{s.city} • {s.tagline}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono text-gold-300">
                    <span>★ {s.ratingAvg.toFixed(1)}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{s.currentQueueLength} in queue</span>
                  </div>
                </div>
                <Link
                  href={`/salon/${s.slug}/book`}
                  className="px-4 py-2 rounded-xl bg-gold-400 text-black text-xs font-bold shadow-gold-glow"
                >
                  Book
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TAB: Loyalty */}
        {activeTab === "loyalty" && (
          <div className="rounded-3xl glass-panel p-8 border border-white/10 max-w-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center text-gold-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Haute Privilege Wallet</h3>
                <p className="text-xs text-zinc-400">Earn 50 reward points for every completed queue visit.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-xs font-mono uppercase text-zinc-400 block">Available Balance</span>
              <span className="font-mono text-5xl font-black gold-text-gradient my-1 block">240 PTS</span>
              <p className="text-xs text-gold-300">Redeemable for ₹1,200 on your next bespoke hair spa.</p>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewToken && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-gold-400/30 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-white">Share Your Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          reviewRating >= star
                            ? "fill-gold-400 text-gold-400"
                            : "text-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Your Feedback & Experience</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was your stylist, chair comfort, and wait time accuracy?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-gold-300 to-amber-500 shadow-gold-glow"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

