"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Store,
  Users,
  Ticket,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Sliders,
  FileText,
  Lock,
} from "lucide-react";
import { useQueueWiseStore } from "@/lib/db/store";
import { DEMO_USERS } from "@/lib/seed/data";
import { toast } from "sonner";

export default function SuperAdminDashboard() {
  const { salons, updateSalonStatus, tokens, currentUser } = useQueueWiseStore();

  const [activeTab, setActiveTab] = useState<"salons" | "users" | "logs">("salons");
  const [salonSearch, setSalonSearch] = useState("");

  const handleApprove = (salonId: string, name: string) => {
    updateSalonStatus(salonId, "approved");
    toast.success(`Approved listing for ${name}. Live on marketplace.`);
  };

  const handleSuspend = (salonId: string, name: string) => {
    updateSalonStatus(salonId, "suspended");
    toast.error(`Suspended listing for ${name}.`);
  };

  const filteredSalons = salons.filter((s) =>
    s.name.toLowerCase().includes(salonSearch.toLowerCase()) ||
    s.city.toLowerCase().includes(salonSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0A0B] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Platform Command Center</span>
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-white">
                QueueWise Super Admin
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Overseeing {salons.length} registered salons • 1,420 registered users • 99.98% platform uptime
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Salons</span>
                <span className="font-mono text-xl font-bold text-white">{salons.length}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Daily GMV</span>
                <span className="font-mono text-xl font-bold text-gold-300">₹1.84L</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Active Tokens</span>
                <span className="font-mono text-xl font-bold text-emerald-400">{tokens.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab("salons")}
            className={`py-3 px-5 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "salons" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Salons Moderation ({salons.length})</span>
            {activeTab === "salons" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`py-3 px-5 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "users" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>User Accounts</span>
            {activeTab === "users" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`py-3 px-5 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === "logs" ? "text-gold-300" : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Security & Audit Trail</span>
            {activeTab === "logs" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-300 to-amber-500" />
            )}
          </button>
        </div>

        {/* TAB 1: Salons Moderation */}
        {activeTab === "salons" && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Search salons by name or city..."
                value={salonSearch}
                onChange={(e) => setSalonSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] text-zinc-400 uppercase font-mono text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Salon Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSalons.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-white">{s.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">/{s.slug}</p>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">{s.city}</td>
                      <td className="py-3.5 px-4 font-mono text-gold-300">★ {s.ratingAvg.toFixed(1)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                            s.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : "bg-red-500/10 text-red-300 border border-red-500/20"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {s.status !== "approved" ? (
                            <button
                              onClick={() => handleApprove(s.id, s.name)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspend(s.id, s.name)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 font-semibold"
                            >
                              Suspend
                            </button>
                          )}
                          <Link
                            href={`/salon/${s.slug}`}
                            className="px-2 py-1 rounded-lg text-zinc-400 hover:text-white"
                          >
                            Inspect
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Users */}
        {activeTab === "users" && (
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] text-zinc-400 uppercase font-mono text-[10px] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DEMO_USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{u.fullName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gold-300 uppercase">{u.role}</td>
                    <td className="py-3.5 px-4 text-zinc-400">{u.phone || "N/A"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toast.info(`Action triggered for ${u.fullName}`)}
                        className="text-zinc-400 hover:text-white"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Audit Logs */}
        {activeTab === "logs" && (
          <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-3">
            <h3 className="font-serif text-lg font-bold text-white mb-4">Immutable Audit Trail</h3>
            {[
              { time: "2 mins ago", action: "Token #14 called next", user: "Kabir Sen (Owner)", entity: "L'Étoile Atelier" },
              { time: "18 mins ago", action: "Delay broadcast +15m sent", user: "Kabir Sen (Owner)", entity: "L'Étoile Atelier" },
              { time: "42 mins ago", action: "New customer token reserved", user: "Ananya Sharma", entity: "Online Booking Engine" },
              { time: "1 hour ago", action: "Super Admin logged in", user: "Aryan Malhotra", entity: "Security Guard" },
            ].map((log, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-gold-300 font-bold">{log.action}</span>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{log.user} • {log.entity}</p>
                </div>
                <span className="font-mono text-[10px] text-zinc-500">{log.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

