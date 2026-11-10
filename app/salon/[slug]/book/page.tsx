"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Scissors,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { Service, Staff } from "@/lib/types";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function BookTokenPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const { getSalonBySlug, createToken, currentUser } = useQueueWiseStore();
  const salon = getSalonBySlug(slug);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form selections
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>("14:00 - 14:45");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [customerName, setCustomerName] = useState(currentUser?.fullName || "Ananya Sharma");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "+91 99887 66554");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!salon) {
    return (
      <div className="min-h-screen pt-32 text-center text-white">
        <p>Salon not found.</p>
        <Link href="/" className="text-gold-300 underline mt-2 block">
          Return Home
        </Link>
      </div>
    );
  }

  // Auto-calculated totals
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.durationMin, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const toggleService = (srv: Service) => {
    if (selectedServices.some((s) => s.id === srv.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  // Available slots mockup with remaining seats
  const timeSlots = [
    { time: "11:00 - 11:45", seatsLeft: 2, isPast: false },
    { time: "12:00 - 12:45", seatsLeft: 1, isPast: false },
    { time: "13:30 - 14:15", seatsLeft: 3, isPast: false },
    { time: "14:30 - 15:15", seatsLeft: 2, isPast: false },
    { time: "16:00 - 16:45", seatsLeft: 0, isPast: false }, // Full
    { time: "17:30 - 18:15", seatsLeft: 4, isPast: false },
    { time: "19:00 - 19:45", seatsLeft: 1, isPast: false },
  ];

  const handleGenerateToken = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and contact phone number.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const token = createToken({
        salonId: salon.id,
        customerName,
        customerPhone,
        customerEmail: currentUser?.email || "customer@demo.com",
        services: selectedServices,
        date: selectedDate,
        slotStart: selectedSlot.split(" - ")[0],
        slotEnd: selectedSlot.split(" - ")[1],
        staffId: selectedStaffId === "any" ? undefined : selectedStaffId,
        notes,
        type: "online",
      });

      // Launch victory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E6C887", "#B8893B", "#FFFFFF"],
        });
      } catch (e) {
        // Safe fail
      }

      toast.success(`Token #${token.tokenNo} generated!`, {
        description: `Your live ticket is now active. Estimated wait ~${token.estWaitMin} mins.`,
      });

      setSubmitting(false);
      router.push(`/token/${token.id}`);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0A0B] px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link & Header */}
        <div className="mb-6">
          <Link
            href={`/salon/${salon.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-gold-300 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {salon.name}</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Reserve Your Live Token
          </h1>
          <p className="text-xs sm:text-sm text-gold-300/80 mt-1">
            {salon.name} • {salon.address}, {salon.city}
          </p>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 mb-8">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: "Services" },
              { num: 2, label: "Date & Slot" },
              { num: 3, label: "Stylist" },
              { num: 4, label: "Confirm" },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-xl transition-all ${
                  step === s.num
                    ? "bg-gold-400/20 text-gold-200 border border-gold-400/30 font-semibold"
                    : step > s.num
                    ? "text-emerald-400"
                    : "text-zinc-500"
                }`}
              >
                <div className="text-[11px] font-mono uppercase tracking-wider">
                  Step 0{s.num}
                </div>
                <div className="text-xs sm:text-sm truncate">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Select Services */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Select Services</h2>
                <p className="text-xs text-zinc-400">Choose one or more treatments for your session.</p>
              </div>
              <span className="text-xs font-mono text-gold-300">
                {selectedServices.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salon.services?.map((srv) => {
                const isSelected = selectedServices.some((s) => s.id === srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv)}
                    className={`rounded-2xl p-5 border cursor-pointer transition-all ${
                      isSelected
                        ? "glass-panel-gold border-gold-400/40 shadow-gold-glow"
                        : "glass-panel border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="text-[10px] font-mono uppercase text-gold-300 block mb-1">
                          {srv.category}
                        </span>
                        <h4 className="font-serif text-base font-bold text-white">
                          {srv.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                          {srv.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-xs font-mono">
                          <span className="text-zinc-300">{formatDuration(srv.durationMin)}</span>
                          <span className="text-gold-300 font-bold">{formatCurrency(srv.price)}</span>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-gold-400 border-gold-400 text-black"
                            : "border-white/20 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 1 Footer Tally */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-400 block">Total Est. Duration & Investment:</span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="font-mono text-xl font-bold text-white">
                    {formatCurrency(totalPrice)}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="font-mono text-sm text-gold-300">
                    {formatDuration(totalDuration || 30)}
                  </span>
                </div>
              </div>

              <button
                disabled={selectedServices.length === 0}
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>Continue to Date & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date & Slot Picker */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Choose Date & Arrival Window</h2>
              <p className="text-xs text-zinc-400">Pick your preferred slot. You can check live queue progress anytime.</p>
            </div>

            {/* Date Selector */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <label className="block text-xs font-medium text-zinc-300 mb-2 uppercase tracking-wider">
                Appointment Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            {/* Time Window Slots */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-3 uppercase tracking-wider">
                Available Arrival Windows
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {timeSlots.map((slot, idx) => {
                  const isFull = slot.seatsLeft === 0;
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={idx}
                      disabled={isFull}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isFull
                          ? "opacity-30 cursor-not-allowed bg-white/[0.01] border-white/5"
                          : isSelected
                          ? "glass-panel-gold border-gold-400/40 text-gold-200 shadow-gold-glow"
                          : "glass-panel border-white/10 hover:border-white/20 text-zinc-300"
                      }`}
                    >
                      <div className="font-mono text-sm font-semibold">{slot.time}</div>
                      <div className="text-[10px] mt-1">
                        {isFull ? (
                          <span className="text-red-400">Full</span>
                        ) : (
                          <span className="text-emerald-400">{slot.seatsLeft} chairs left</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center gap-2"
              >
                <span>Continue to Stylist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Choose Preferred Stylist */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Preferred Stylist (Optional)</h2>
              <p className="text-xs text-zinc-400">Select your favorite artisan or choose 'First Available' for the shortest wait.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option: Any Available */}
              <div
                onClick={() => setSelectedStaffId("any")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedStaffId === "any"
                    ? "glass-panel-gold border-gold-400/40 shadow-gold-glow"
                    : "glass-panel border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">
                      First Available Stylist
                    </h4>
                    <p className="text-xs text-emerald-400 font-mono">Recommended for fastest turn</p>
                  </div>
                </div>
              </div>

              {/* Specific Staff */}
              {salon.staff?.map((stf) => (
                <div
                  key={stf.id}
                  onClick={() => setSelectedStaffId(stf.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedStaffId === stf.id
                      ? "glass-panel-gold border-gold-400/40 shadow-gold-glow"
                      : "glass-panel border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={stf.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"}
                      alt={stf.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gold-400/30"
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-white">{stf.name}</h4>
                      <p className="text-xs text-zinc-400">{stf.roleTitle}</p>
                      <p className="text-[10px] font-mono text-gold-300">★ {stf.rating.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl font-semibold text-xs text-black bg-gradient-to-r from-gold-300 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center gap-2"
              >
                <span>Review & Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Generate Token */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Review & Confirm Token</h2>
              <p className="text-xs text-zinc-400">Verify your details before generating your live digital token ticket.</p>
            </div>

            {/* Summary Boarding Pass Preview */}
            <div className="glass-panel-gold rounded-3xl p-6 sm:p-7 border border-gold-400/30">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Salon Destination</span>
                  <h3 className="font-serif text-lg font-bold text-white">{salon.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Date & Window</span>
                  <span className="text-xs font-mono text-gold-300 font-bold">{selectedDate} ({selectedSlot})</span>
                </div>
              </div>

              {/* Selected Services List */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Chosen Services ({selectedServices.length})
                </span>
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-zinc-200">{s.name} ({s.durationMin}m)</span>
                    <span className="font-mono text-gold-300">{formatCurrency(s.price)}</span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="text-xs text-zinc-400">Total Investment</span>
                  <p className="font-mono text-xl font-bold text-white">{formatCurrency(totalPrice)}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400">Total Session Time</span>
                  <p className="font-mono text-sm text-gold-300">{formatDuration(totalDuration)}</p>
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Guest Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-gold-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-gold-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Stylist Notes or Preferences (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sensitive scalp, prefer quiet session, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Final Action Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-zinc-300"
              >
                Back
              </button>

              <button
                onClick={handleGenerateToken}
                disabled={submitting}
                className="px-8 py-3.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 transition-all shadow-gold-glow flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Live Token Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

