"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Users,
  SlidersHorizontal,
  Map,
  Grid,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { formatCurrency } from "@/lib/utils";

export default function SalonDirectory() {
  const { salons } = useQueueWiseStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [sortBy, setSortBy] = useState<"queue" | "rating" | "popular">("queue");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const cities = useMemo(() => {
    const list = Array.from(new Set(salons.map((s) => s.city)));
    return ["all", ...list];
  }, [salons]);

  const filteredSalons = useMemo(() => {
    return salons
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tagline.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === "all" || s.city.toLowerCase() === selectedCity.toLowerCase();
        const matchesGender = selectedGender === "all" || s.genderType === selectedGender;
        return matchesSearch && matchesCity && matchesGender;
      })
      .sort((a, b) => {
        if (sortBy === "queue") {
          return (a.currentQueueLength || 0) - (b.currentQueueLength || 0);
        }
        if (sortBy === "rating") {
          return b.ratingAvg - a.ratingAvg;
        }
        return b.ratingCount - a.ratingCount;
      });
  }, [salons, searchQuery, selectedCity, selectedGender, sortBy]);

  return (
    <section id="salons" className="py-24 bg-[#0A0A0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Discover Haute Grooming</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Find Your Elite Salon
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-2 font-light">
            Check real-time queue lengths and book your live token before stepping out.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel rounded-3xl p-4 sm:p-6 mb-10 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by salon name, area, haircut..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              />
            </div>

            {/* City Filter Pills */}
            <div className="md:col-span-3 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap capitalize transition-all ${
                    selectedCity === c
                      ? "bg-gold-400/20 text-gold-200 border border-gold-400/30"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {c === "all" ? "All Metros" : c}
                </button>
              ))}
            </div>

            {/* Gender Category */}
            <div className="md:col-span-2 flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10">
              {(["all", "unisex", "men", "women"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all ${
                    selectedGender === g
                      ? "bg-white/15 text-gold-200 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sort & View Mode */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-gold-400"
              >
                <option value="queue">Shortest Queue</option>
                <option value="rating">Top Rated (4.9+)</option>
                <option value="popular">Most Booked</option>
              </select>

              <button
                onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-200 transition-colors"
                title="Toggle Map View"
              >
                {viewMode === "grid" ? <Map className="w-4 h-4 text-gold-300" /> : <Grid className="w-4 h-4 text-gold-300" />}
                <span className="hidden sm:inline">{viewMode === "grid" ? "Map" : "Cards"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Map View */}
        {viewMode === "map" ? (
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 h-[540px] flex flex-col items-center justify-center p-8 text-center bg-[#111114]">
            {/* Stylized Dark Luxury Map Mockup */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#E6C887_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 max-w-lg space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-300 mx-auto">
                <MapPin className="w-7 h-7 animate-bounce" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Interactive Metro Map View
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Displaying {filteredSalons.length} verified salons across Mumbai, Delhi, Bangalore, and Goa with live chair signals.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {filteredSalons.slice(0, 4).map((s) => (
                  <Link
                    key={s.id}
                    href={`/salon/${s.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-gold-500/20 border border-gold-400/20 text-xs text-gold-200 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{s.name.split(" ")[0]} ({s.currentQueueLength} in queue)</span>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => setViewMode("grid")}
                className="mt-4 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Back to Card View
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredSalons.map((salon) => (
              <div
                key={salon.id}
                className="group rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold-glow flex flex-col"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={salon.coverUrl}
                    alt={salon.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/20 to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-mono font-bold">
                    <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    <span>{salon.ratingAvg.toFixed(1)}</span>
                    <span className="text-[10px] text-zinc-400">({salon.ratingCount})</span>
                  </div>

                  {/* Gender Category */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-gold-300 text-[10px] font-mono uppercase tracking-wider">
                    {salon.genderType}
                  </div>

                  {/* Live Queue Length Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold-400/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono text-zinc-200">
                      <strong className="text-gold-200">{salon.currentQueueLength || 0}</strong> in queue
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs font-mono text-zinc-300">
                      ~{salon.estWaitTimeMin || 15}m wait
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-200 transition-colors">
                      {salon.name}
                    </h3>
                    <p className="text-xs text-gold-300/80 mt-1 line-clamp-1 font-medium">
                      {salon.tagline}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-3">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span className="line-clamp-1">{salon.address}, {salon.city}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span>Open Today: 09:30 AM – 09:00 PM</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                    <Link
                      href={`/salon/${salon.slug}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold text-center transition-colors"
                    >
                      View Details
                    </Link>

                    <Link
                      href={`/salon/${salon.slug}/book`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 text-black text-xs font-bold text-center transition-all shadow-gold-glow flex items-center justify-center gap-1"
                    >
                      <span>Book Token</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

