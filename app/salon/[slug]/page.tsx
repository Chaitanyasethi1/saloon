"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Star,
  Users,
  Armchair,
  Scissors,
  Sparkles,
  Heart,
  Share2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { toast } from "sonner";

export default function SalonDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const { getSalonBySlug, reviews, favorites, toggleFavorite } = useQueueWiseStore();
  const salon = getSalonBySlug(slug);

  const [activeTab, setActiveTab] = useState<"services" | "staff" | "reviews" | "hours">("services");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!salon) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-3xl font-bold text-white mb-2">Salon Not Found</h1>
        <p className="text-zinc-400 text-sm mb-6">The salon you requested is not available in our registry.</p>
        <Link
          href="/#salons"
          className="px-6 py-2.5 rounded-full bg-gold-400 text-black text-xs font-bold"
        >
          Browse All Salons
        </Link>
      </div>
    );
  }

  const isFav = favorites.includes(salon.id);
  const salonReviews = reviews.filter((r) => r.salonId === salon.id);

  const categories = [
    "All",
    ...Array.from(new Set(salon.services?.map((s) => s.category) || [])),
  ];

  const filteredServices = salon.services?.filter(
    (s) => selectedCategory === "All" || s.category === selectedCategory
  ) || [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: salon.name,
        text: `Book your live token at ${salon.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Salon link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 bg-[#0A0A0B]">
      {/* Hero Cover Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        <img
          src={salon.coverUrl}
          alt={salon.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent" />

        {/* Quick Top Actions */}
        <div className="absolute top-6 right-4 sm:right-8 flex items-center gap-2 z-10">
          <button
            onClick={() => {
              toggleFavorite(salon.id);
              toast.success(isFav ? "Removed from favorites" : "Added to favorites!");
            }}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-rose-glow transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFav ? "fill-rose-glow text-rose-glow" : ""}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-gold-300 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Salon Headline Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-gold-400/10 text-gold-300 border border-gold-400/20">
                  {salon.genderType} Atelier
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open Now • Closes 9:00 PM</span>
                </span>
                <div className="flex items-center gap-1 text-gold-400 text-sm font-bold font-mono">
                  <Star className="w-4 h-4 fill-gold-400" />
                  <span>{salon.ratingAvg.toFixed(2)}</span>
                  <span className="text-zinc-500 text-xs">({salon.ratingCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {salon.name}
              </h1>
              <p className="text-sm text-gold-300/90 font-medium mt-1">
                {salon.tagline}
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{salon.address}, {salon.city}, {salon.state}</span>
              </div>
            </div>

            {/* Live Queue Capsule */}
            <div className="glass-panel-gold p-4 sm:p-5 rounded-2xl border border-gold-400/30 flex items-center gap-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  Live Queue
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-3xl font-extrabold text-white">
                    {salon.currentQueueLength || 0}
                  </span>
                  <span className="text-xs text-zinc-400">clients ahead</span>
                </div>
                <p className="text-xs text-gold-300/80 font-mono mt-1">
                  Est. Wait: ~{salon.estWaitTimeMin || 15} mins
                </p>
              </div>

              <div className="border-l border-white/10 pl-6 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  Now Serving
                </span>
                <span className="font-mono text-3xl font-extrabold text-emerald-400 block mt-0.5">
                  #{salon.nowServingTokenNo || 12}
                </span>
                <span className="text-[10px] text-zinc-500 block">Chair 01</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Strip */}
        {salon.gallery && salon.gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {salon.gallery.map((img, i) => (
              <div key={i} className="h-36 sm:h-48 rounded-2xl overflow-hidden glass-panel border border-white/10">
                <img
                  src={img}
                  alt={`${salon.name} preview ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mb-8 pb-1">
          <button
            onClick={() => setActiveTab("services")}
            className={`py-3 px-5 text-sm font-semibold transition-all relative ${
              activeTab === "services" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Services & Pricing</span>
            {activeTab === "services" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`py-3 px-5 text-sm font-semibold transition-all relative ${
              activeTab === "staff" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Master Stylists ({salon.staff?.length || 3})</span>
            {activeTab === "staff" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-3 px-5 text-sm font-semibold transition-all relative ${
              activeTab === "reviews" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Client Reviews ({salonReviews.length})</span>
            {activeTab === "reviews" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("hours")}
            className={`py-3 px-5 text-sm font-semibold transition-all relative ${
              activeTab === "hours" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Hours & Amenities</span>
            {activeTab === "hours" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>
        </div>

        {/* Tab 1: Services */}
        {activeTab === "services" && (
          <div>
            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-gold-400/20 text-gold-200 border border-gold-400/30"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="rounded-2xl glass-panel p-5 border border-white/10 hover:border-gold-400/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {srv.imageUrl && (
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                      />
                    )}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gold-300">
                        {srv.category}
                      </span>
                      <h4 className="font-serif text-base font-bold text-white">
                        {srv.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {srv.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs font-mono text-zinc-400">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{formatDuration(srv.durationMin)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-base font-bold text-white block">
                      {formatCurrency(srv.price)}
                    </span>
                    <Link
                      href={`/salon/${salon.slug}/book`}
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 text-gold-300 text-xs font-semibold transition-colors"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Staff */}
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(salon.staff || []).map((stf) => (
              <div
                key={stf.id}
                className="rounded-2xl glass-panel p-6 border border-white/10 hover:border-gold-400/30 transition-all flex items-center gap-4"
              >
                <img
                  src={stf.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"}
                  alt={stf.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-gold-400/30"
                />
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">{stf.name}</h4>
                  <p className="text-xs text-gold-300/80">{stf.roleTitle}</p>
                  <div className="flex items-center gap-1 text-gold-400 text-xs font-bold font-mono mt-1">
                    <Star className="w-3 h-3 fill-gold-400" />
                    <span>{stf.rating.toFixed(2)} Rating</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {stf.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Verified Customer Reviews</h3>
                <p className="text-xs text-zinc-400 mt-1">Only verified guests who completed a live queue turn can leave ratings.</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-3xl font-extrabold gold-text-gradient">{salon.ratingAvg.toFixed(1)}</span>
                <span className="text-xs text-zinc-400 block">Out of 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {salonReviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.customerAvatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"}
                        alt={rev.customerName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{rev.customerName}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          Visited {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gold-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    “{rev.comment}”
                  </p>

                  {rev.ownerReply && (
                    <div className="mt-3 p-3.5 rounded-xl bg-white/[0.02] border-l-2 border-gold-400 text-xs text-zinc-300">
                      <p className="font-semibold text-gold-300 text-[11px] mb-0.5">Response from Proprietor:</p>
                      <p className="text-zinc-400 font-light">{rev.ownerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Hours & Policies */}
        {activeTab === "hours" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white">Opening Schedule</h3>
              <div className="space-y-2 text-xs">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-zinc-400">{day}</span>
                      <span className="font-mono text-zinc-200">
                        {day === "Sunday" ? "10:00 AM – 08:00 PM" : "09:30 AM – 09:00 PM"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="font-serif text-lg font-bold text-white">Queue & Cancellation Policies</h3>
              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Free cancellation up to 30 minutes before your estimated chair turn.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>15-minute grace holding period if delayed in transit before mark as no-show.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Complimentary single malt, matcha, and acoustic isolation pods in waiting lounge.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0A0A0B]/90 backdrop-blur-xl border-t border-white/10 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs text-zinc-400">Ready for your bespoke turn?</p>
            <p className="font-serif text-base font-bold text-white">{salon.name}</p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Queue Status</span>
              <span className="text-xs font-mono font-bold text-gold-300">
                {salon.currentQueueLength} waiting • ~{salon.estWaitTimeMin} min
              </span>
            </div>

            <Link
              href={`/salon/${salon.slug}/book`}
              className="px-6 py-2.5 rounded-full font-bold text-xs text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center gap-2"
            >
              <span>Book Token Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

