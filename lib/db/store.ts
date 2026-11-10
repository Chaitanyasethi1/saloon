"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Salon,
  Token,
  UserProfile,
  Review,
  TokenStatus,
  TokenType,
  Service,
} from "../types";
import { DEMO_SALONS, DEMO_TOKENS, DEMO_USERS, DEMO_REVIEWS } from "../seed/data";
import { calculateEstimatedWait } from "../utils";

interface QueueWiseStore {
  // Auth state
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  switchDemoRole: (role: "admin" | "owner" | "staff" | "customer") => void;
  logout: () => void;

  // Data
  salons: Salon[];
  tokens: Token[];
  reviews: Review[];
  favorites: string[]; // salon IDs

  // Actions
  getSalonBySlug: (slug: string) => Salon | undefined;
  getSalonById: (id: string) => Salon | undefined;
  getSalonTokens: (salonId: string, date?: string) => Token[];
  getCustomerTokens: (customerId: string) => Token[];
  getTokenById: (tokenId: string) => Token | undefined;

  // Booking Flow
  createToken: (payload: {
    salonId: string;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    services: Service[];
    date: string;
    slotStart?: string;
    slotEnd?: string;
    staffId?: string;
    notes?: string;
    type?: TokenType;
  }) => Token;

  // Queue Management (Owner / Staff)
  callNextToken: (salonId: string) => Token | null;
  updateTokenStatus: (tokenId: string, status: TokenStatus, chairId?: string, staffId?: string) => void;
  addWalkInToken: (
    salonId: string,
    customerName: string,
    phone: string,
    services: Service[],
    isPriority?: boolean
  ) => Token;
  broadcastDelay: (salonId: string, delayMinutes: number, reason: string) => void;
  toggleFavorite: (salonId: string) => void;
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;

  // Admin Actions
  updateSalonStatus: (salonId: string, status: "approved" | "pending" | "suspended") => void;

  // TV / Kiosk state
  lastCalledToken: Token | null;
  clearLastCalledToken: () => void;
}

export const useQueueWiseStore = create<QueueWiseStore>()(
  persist(
    (set, get) => ({
      currentUser: DEMO_USERS.find((u) => u.email === "customer@demo.com") || null,
      salons: DEMO_SALONS,
      tokens: DEMO_TOKENS,
      reviews: DEMO_REVIEWS,
      favorites: ["salon-1"],
      lastCalledToken: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      switchDemoRole: (role) => {
        let email = "customer@demo.com";
        if (role === "admin") email = "admin@queuewise.app";
        if (role === "owner") email = "owner@demo.com";
        if (role === "staff") email = "staff@demo.com";

        const user = DEMO_USERS.find((u) => u.email === email) || null;
        set({ currentUser: user });
      },

      logout: () => set({ currentUser: null }),

      getSalonBySlug: (slug) => {
        return get().salons.find((s) => s.slug === slug);
      },

      getSalonById: (id) => {
        return get().salons.find((s) => s.id === id);
      },

      getSalonTokens: (salonId, date) => {
        const today = date || new Date().toISOString().split("T")[0];
        return get()
          .tokens.filter((t) => t.salonId === salonId && t.date === today)
          .sort((a, b) => a.tokenNo - b.tokenNo);
      },

      getCustomerTokens: (customerId) => {
        return get()
          .tokens.filter((t) => t.customerId === customerId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getTokenById: (tokenId) => {
        const token = get().tokens.find((t) => t.id === tokenId);
        if (!token) return undefined;
        const salon = get().salons.find((s) => s.id === token.salonId);
        return {
          ...token,
          salon,
        };
      },

      createToken: ({
        salonId,
        customerName,
        customerPhone,
        customerEmail,
        services,
        date,
        slotStart,
        slotEnd,
        staffId,
        notes,
        type = "online",
      }) => {
        const state = get();
        const salon = state.salons.find((s) => s.id === salonId);
        const existingDayTokens = state.tokens.filter(
          (t) => t.salonId === salonId && t.date === date
        );

        const nextTokenNo =
          existingDayTokens.length > 0
            ? Math.max(...existingDayTokens.map((t) => t.tokenNo)) + 1
            : 1;

        const activeTokensAhead = existingDayTokens.filter(
          (t) => t.status === "booked" || t.status === "checked_in"
        ).length;

        const totalDuration = services.reduce((acc, s) => acc + s.durationMin, 0);
        const avgDuration = Math.round(totalDuration / Math.max(1, services.length)) || 35;
        const estWait = calculateEstimatedWait(
          activeTokensAhead,
          avgDuration,
          salon?.chairsCount || 4
        );

        const newTokenId = `tkn-${Date.now()}-${nextTokenNo}`;
        const newToken: Token = {
          id: newTokenId,
          salonId,
          customerId: state.currentUser?.id,
          customerName,
          customerPhone: customerPhone || state.currentUser?.phone,
          customerEmail: customerEmail || state.currentUser?.email,
          tokenNo: nextTokenNo,
          date,
          slotStart: slotStart || "14:00",
          slotEnd: slotEnd || "14:45",
          type,
          status: "booked",
          staffId,
          estWaitMin: estWait,
          qrCode: `QW-${salon?.slug.toUpperCase().slice(0, 4)}-${nextTokenNo}`,
          notes,
          createdAt: new Date().toISOString(),
          services: services.map((s, idx) => ({
            id: `ts-${Date.now()}-${idx}`,
            tokenId: newTokenId,
            serviceId: s.id,
            serviceName: s.name,
            price: s.price,
            durationMin: s.durationMin,
          })),
          salon,
        };

        const updatedTokens = [...state.tokens, newToken];

        // Also update salon's live queue length
        const updatedSalons = state.salons.map((s) => {
          if (s.id === salonId) {
            return {
              ...s,
              currentQueueLength: (s.currentQueueLength || 0) + 1,
              estWaitTimeMin: Math.max(s.estWaitTimeMin || 0, estWait),
            };
          }
          return s;
        });

        set({ tokens: updatedTokens, salons: updatedSalons });
        return newToken;
      },

      callNextToken: (salonId) => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];
        const dayTokens = state.tokens.filter(
          (t) => t.salonId === salonId && t.date === today
        );

        // Find candidate token: prioritize checked_in, then booked
        const nextInLine =
          dayTokens.find((t) => t.status === "checked_in") ||
          dayTokens.find((t) => t.status === "booked");

        if (!nextInLine) return null;

        const updatedTokens = state.tokens.map((t) => {
          if (t.id === nextInLine.id) {
            return {
              ...t,
              status: "in_service" as TokenStatus,
              startedAt: new Date().toISOString(),
              chairId: "chair-1",
            };
          }
          return t;
        });

        const updatedSalons = state.salons.map((s) => {
          if (s.id === salonId) {
            return {
              ...s,
              nowServingTokenNo: nextInLine.tokenNo,
              currentQueueLength: Math.max(0, (s.currentQueueLength || 1) - 1),
            };
          }
          return s;
        });

        const calledToken = { ...nextInLine, status: "in_service" as TokenStatus };
        set({
          tokens: updatedTokens,
          salons: updatedSalons,
          lastCalledToken: calledToken,
        });

        return calledToken;
      },

      updateTokenStatus: (tokenId, status, chairId, staffId) => {
        const state = get();
        const target = state.tokens.find((t) => t.id === tokenId);
        if (!target) return;

        const updatedTokens = state.tokens.map((t) => {
          if (t.id === tokenId) {
            return {
              ...t,
              status,
              ...(status === "checked_in" ? { checkedInAt: new Date().toISOString() } : {}),
              ...(status === "in_service" ? { startedAt: new Date().toISOString(), chairId, staffId } : {}),
              ...(status === "completed" ? { completedAt: new Date().toISOString() } : {}),
            };
          }
          return t;
        });

        const updatedSalons = state.salons.map((s) => {
          if (s.id === target.salonId && status === "completed") {
            return {
              ...s,
              currentQueueLength: Math.max(0, (s.currentQueueLength || 1) - 1),
            };
          }
          return s;
        });

        set({ tokens: updatedTokens, salons: updatedSalons });
      },

      addWalkInToken: (salonId, customerName, phone, services, isPriority = false) => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];
        const token = state.createToken({
          salonId,
          customerName,
          customerPhone: phone,
          services,
          date: today,
          type: isPriority ? "priority" : "walk_in",
        });

        // Walk-in is auto checked-in upon arrival at the salon reception
        state.updateTokenStatus(token.id, "checked_in");
        return token;
      },

      broadcastDelay: (salonId, delayMinutes, reason) => {
        const state = get();
        const updatedSalons = state.salons.map((s) => {
          if (s.id === salonId) {
            return {
              ...s,
              settings: {
                ...s.settings,
                delayNoticeMins: delayMinutes,
              },
              estWaitTimeMin: (s.estWaitTimeMin || 0) + delayMinutes,
            };
          }
          return s;
        });

        set({ salons: updatedSalons });
      },

      toggleFavorite: (salonId) => {
        const { favorites } = get();
        if (favorites.includes(salonId)) {
          set({ favorites: favorites.filter((id) => id !== salonId) });
        } else {
          set({ favorites: [...favorites, salonId] });
        }
      },

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set({ reviews: [newReview, ...get().reviews] });
      },

      updateSalonStatus: (salonId, status) => {
        const updatedSalons = get().salons.map((s) =>
          s.id === salonId ? { ...s, status } : s
        );
        set({ salons: updatedSalons });
      },

      clearLastCalledToken: () => set({ lastCalledToken: null }),
    }),
    {
      name: "queuewise-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        tokens: state.tokens,
        favorites: state.favorites,
        salons: state.salons,
        reviews: state.reviews,
      }),
    }
  )
);
