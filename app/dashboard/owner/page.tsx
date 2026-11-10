"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Radio,
  Tv,
  QrCode,
  TrendingUp,
  Sliders,
  DollarSign,
  ArrowRight,
  Sparkles,
  Scissors,
  Phone,
  FileSpreadsheet,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQueueWiseStore } from "@/lib/db/store";
import { formatCurrency, formatDuration, getStatusBadge } from "@/lib/utils";
import { TokenStatus, Service } from "@/lib/types";
import { toast } from "sonner";

export default function SalonOwnerDashboard() {
  const {
    salons,
    tokens,
    callNextToken,
    updateTokenStatus,
    addWalkInToken,
    broadcastDelay,
    getSalonTokens,
    currentUser,
  } = useQueueWiseStore();

  const salon = salons[0]; // Active salon (L'Étoile Atelier de Beauté)
  const salonTokens = salon ? getSalonTokens(salon.id) : [];

  const [activeTab, setActiveTab] = useState<"queue" | "analytics" | "services" | "staff" | "settings">("queue");

  // Modals state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showQrScanModal, setShowQrScanModal] = useState(false);

  // Walk-in form state
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInServiceId, setWalkInServiceId] = useState(salon?.services?.[0]?.id || "");
  const [isPriority, setIsPriority] = useState(false);

  // Delay form state
  const [delayMins, setDelayMins] = useState(15);
  const [delayReason, setDelayReason] = useState("Complex bridal styling in progress");

  // Scan input
  const [scannedTokenNo, setScannedTokenNo] = useState("");

  const handleCallNext = () => {
    const called = callNextToken(salon.id);
    if (called) {
      toast.success(`Token #${called.tokenNo} Called!`, {
        description: `${called.customerName} assigned to Chair 01. Announcement triggered on TV Kiosk.`,
      });
    } else {
      toast.info("No more guests waiting in the queue.");
    }
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName) return;

    const chosenService = salon.services?.find((s) => s.id === walkInServiceId) || salon.services?.[0];
    if (!chosenService) return;

    const token = addWalkInToken(salon.id, walkInName, walkInPhone, [chosenService], isPriority);
    toast.success(`Walk-in Token #${token.tokenNo} Generated!`, {
      description: `${isPriority ? "Priority" : "Standard"} token added and marked checked-in.`,
    });

    setWalkInName("");
    setWalkInPhone("");
    setShowWalkInModal(false);
  };

  const handleBroadcastDelay = (e: React.FormEvent) => {
    e.preventDefault();
    broadcastDelay(salon.id, Number(delayMins), delayReason);
    toast.warning(`Delay Notice Broadcasted (${delayMins} min)`, {
      description: "All queued guests have received updated arrival alerts.",
    });
    setShowDelayModal(false);
  };

  const handleManualScanCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const token = salonTokens.find(
      (t) => String(t.tokenNo) === scannedTokenNo || t.id.includes(scannedTokenNo)
    );
    if (token) {
      updateTokenStatus(token.id, "checked_in");
      toast.success(`Checked In Token #${token.tokenNo} (${token.customerName})`);
      setScannedTokenNo("");
      setShowQrScanModal(false);
    } else {
      toast.error(`Token #${scannedTokenNo} not found in today's registry.`);
    }
  };

  // Analytics mockup data
  const revenueData = [
    { time: "10 AM", revenue: 4500, clients: 3 },
    { time: "12 PM", revenue: 11200, clients: 7 },
    { time: "02 PM", revenue: 18400, clients: 12 },
    { time: "04 PM", revenue: 29800, clients: 18 },
    { time: "06 PM", revenue: 38600, clients: 24 },
    { time: "08 PM", revenue: 47200, clients: 30 },
  ];

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["TokenNo,Customer,Type,Status,WaitMins,Price"].join(",") +
      "\n" +
      salonTokens
        .map(
          (t) =>
            `${t.tokenNo},"${t.customerName}",${t.type},${t.status},${t.estWaitMin},${t.services?.[0]?.price || 0}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `QueueWise_Report_${salon.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Report exported successfully!");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0A0B] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-gold-400/10 text-gold-300 border border-gold-400/20">
                  Proprietor Console
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Engine Online</span>
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {salon?.name || "QueueWise Atelier"}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Branch: Bandra Main • 5 Active Styling Chairs • Logged in as Kabir Sen
              </p>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/display/${salon.slug}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gold-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Tv className="w-4 h-4 text-gold-300" />
                <span>Launch TV Kiosk</span>
              </Link>

              <button
                onClick={() => setShowQrScanModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4 text-gold-300" />
                <span>Scan / Check In</span>
              </button>

              <button
                onClick={() => setShowDelayModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Broadcast Delay</span>
              </button>

              <button
                onClick={() => setShowWalkInModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4 text-gold-300" />
                <span>Add Walk-In</span>
              </button>

              {/* Big "Call Next" Button */}
              <button
                onClick={handleCallNext}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 hover:from-gold-200 hover:to-amber-400 shadow-gold-glow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Call Next Token</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto">
          {[
            { id: "queue", label: `Live Queue Console (${salonTokens.length})` },
            { id: "analytics", label: "Analytics & Reports" },
            { id: "services", label: `Services Menu (${salon.services?.length || 0})` },
            { id: "staff", label: `Staff & Chairs (${salon.staff?.length || 0})` },
            { id: "settings", label: "Timings & Capacity" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all relative ${
                activeTab === tab.id ? "text-gold-300" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Live Queue Console */}
        {activeTab === "queue" && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-panel border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Total Today</span>
                <span className="font-mono text-2xl font-bold text-white">{salonTokens.length} Tokens</span>
              </div>
              <div className="p-5 rounded-2xl glass-panel border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Waiting in Lounge</span>
                <span className="font-mono text-2xl font-bold text-gold-300">
                  {salonTokens.filter((t) => t.status === "checked_in").length} Arrived
                </span>
              </div>
              <div className="p-5 rounded-2xl glass-panel border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">In Service</span>
                <span className="font-mono text-2xl font-bold text-emerald-400">
                  {salonTokens.filter((t) => t.status === "in_service").length} Seated
                </span>
              </div>
              <div className="p-5 rounded-2xl glass-panel border border-white/10">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Completed Today</span>
                <span className="font-mono text-2xl font-bold text-zinc-300">
                  {salonTokens.filter((t) => t.status === "completed").length} Done
                </span>
              </div>
            </div>

            {/* Live Queue Table */}
            <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Today's Token Manifest</h3>
                  <p className="text-xs text-zinc-400">Live synchronized state across customer mobile tickets and TV displays.</p>
                </div>
                <button
                  onClick={exportCSV}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gold-300" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] text-zinc-400 uppercase font-mono text-[10px] border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Token #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Est. Wait</th>
                      <th className="py-3 px-4 text-right">Queue Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {salonTokens.map((t) => {
                      const badge = getStatusBadge(t.status);
                      return (
                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-base text-gold-300">
                            #{t.tokenNo}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-white">{t.customerName}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">{t.customerPhone || "N/A"}</p>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300 font-medium">
                            {t.services?.[0]?.serviceName || "Treatment"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                              {t.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-mono border inline-flex items-center gap-1.5 ${badge.bg}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                              <span>{badge.label}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-zinc-300">
                            {t.status === "in_service" ? "0m (In Chair)" : `~${t.estWaitMin}m`}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {t.status === "booked" && (
                                <button
                                  onClick={() => {
                                    updateTokenStatus(t.id, "checked_in");
                                    toast.success(`Token #${t.tokenNo} marked Checked In.`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-gold-400/10 hover:bg-gold-400/20 text-gold-200 border border-gold-400/30 text-[10px] font-semibold"
                                >
                                  Check In
                                </button>
                              )}

                              {t.status === "checked_in" && (
                                <button
                                  onClick={() => {
                                    updateTokenStatus(t.id, "in_service");
                                    toast.success(`Token #${t.tokenNo} marked In Service.`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold"
                                >
                                  Seat Customer
                                </button>
                              )}

                              {t.status === "in_service" && (
                                <button
                                  onClick={() => {
                                    updateTokenStatus(t.id, "completed");
                                    toast.success(`Token #${t.tokenNo} completed!`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[10px] font-semibold"
                                >
                                  Complete
                                </button>
                              )}

                              {t.status !== "completed" && t.status !== "cancelled" && (
                                <button
                                  onClick={() => {
                                    updateTokenStatus(t.id, "no_show");
                                    toast.info(`Token #${t.tokenNo} marked No Show.`);
                                  }}
                                  className="px-2 py-1 rounded-lg text-zinc-400 hover:text-red-400 text-[10px]"
                                  title="Mark as No-Show"
                                >
                                  No Show
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Analytics & Reports */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Area Chart */}
              <div className="rounded-3xl glass-panel p-6 border border-white/10">
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  Today's Cumulative Turnover
                </h3>
                <p className="text-xs text-zinc-400 mb-6">Real-time revenue stream across active chairs.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E6C887" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#E6C887" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#666" fontSize={11} />
                      <YAxis stroke="#666" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111114",
                          borderColor: "rgba(230,200,135,0.3)",
                          color: "#fff",
                          borderRadius: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#E6C887"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#goldGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Client Volume Hourly Distribution */}
              <div className="rounded-3xl glass-panel p-6 border border-white/10">
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  Peak Hours & Chair Turnover
                </h3>
                <p className="text-xs text-zinc-400 mb-6">Clients served per 2-hour window.</p>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="time" stroke="#666" fontSize={11} />
                      <YAxis stroke="#666" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111114",
                          borderColor: "rgba(230,200,135,0.3)",
                          color: "#fff",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="clients" fill="#B8893B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Services Menu */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Active Service Offerings</h3>
                <p className="text-xs text-zinc-400">Configure prices, treatment durations, and active salon availability.</p>
              </div>
              <button
                onClick={() => toast.info("Add new service modal opened.")}
                className="px-4 py-2 rounded-xl bg-gold-400/20 text-gold-200 border border-gold-400/30 text-xs font-semibold"
              >
                + Add New Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salon.services?.map((s) => (
                <div key={s.id} className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gold-300">{s.category}</span>
                    <h4 className="font-serif text-base font-bold text-white">{s.name}</h4>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {formatDuration(s.durationMin)} • {formatCurrency(s.price)}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Staff & Chairs */}
        {activeTab === "staff" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {salon.staff?.map((stf) => (
              <div key={stf.id} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={stf.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"}
                    alt={stf.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gold-400/30"
                  />
                  <div>
                    <h4 className="font-serif text-base font-bold text-white">{stf.name}</h4>
                    <p className="text-xs text-gold-300">{stf.roleTitle}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 flex justify-between">
                  <span>Assigned Station</span>
                  <span className="font-mono text-white font-bold">Station 01</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: Settings */}
        {activeTab === "settings" && (
          <div className="max-w-2xl rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white">Queue Parameters & Capacities</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-300">Maximum Daily Token Capacity</span>
                <span className="font-mono font-bold text-white">60 Tokens / Day</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-300">Cancellation Grace Period</span>
                <span className="font-mono font-bold text-white">30 Minutes</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-300">No-Show Delay Leniency</span>
                <span className="font-mono font-bold text-white">15 Minutes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Add Walk-in Token */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-gold-400/30 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-white">Create Walk-In Token</h3>
              <button onClick={() => setShowWalkInModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Service</label>
                <select
                  value={walkInServiceId}
                  onChange={(e) => setWalkInServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111114] border border-white/10 text-white"
                >
                  {salon.services?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMin}m - {formatCurrency(s.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="priorityCheck"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="rounded border-white/20"
                />
                <label htmlFor="priorityCheck" className="text-gold-300 font-semibold cursor-pointer">
                  VIP Priority Token (Next Chair Allocation)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-gold-300 to-amber-500 hover:from-gold-200 hover:to-amber-400 mt-2 shadow-gold-glow"
              >
                Generate Walk-in Token
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Broadcast Delay */}
      {showDelayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-amber-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-white">Broadcast Lounge Delay</h3>
              <button onClick={() => setShowDelayModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBroadcastDelay} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Additional Delay (Minutes)</label>
                <input
                  type="number"
                  value={delayMins}
                  onChange={(e) => setDelayMins(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Reason for Delay</label>
                <input
                  type="text"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-black bg-amber-400 hover:bg-amber-300 mt-2"
              >
                Send Broadcast Alert to All Clients
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: QR Scanner / Quick Check-In */}
      {showQrScanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-gold-400/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-serif text-lg font-bold text-white">Guest Ticket Check-In</h3>
              <button onClick={() => setShowQrScanModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualScanCheckIn} className="space-y-4 text-xs">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/20 text-center">
                <QrCode className="w-12 h-12 text-gold-300 mx-auto mb-2 animate-pulse" />
                <p className="text-zinc-300 font-semibold">Camera QR Scanner Active</p>
                <p className="text-[10px] text-zinc-500 mt-1">Point your device camera at the customer's boarding pass QR code.</p>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Or Enter Token # / Code Manually</label>
                <input
                  type="text"
                  value={scannedTokenNo}
                  onChange={(e) => setScannedTokenNo(e.target.value)}
                  placeholder="e.g. 14 or QW-TKN-101"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-gold-300 to-amber-500 shadow-gold-glow"
              >
                Verify & Check In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

