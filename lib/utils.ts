import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export function calculateEstimatedWait(
  tokensAheadCount: number,
  avgDurationMins: number = 30,
  activeChairsCount: number = 4
): number {
  if (tokensAheadCount <= 0) return 0;
  const chairs = Math.max(1, activeChairsCount);
  return Math.ceil((tokensAheadCount * avgDurationMins) / chairs);
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "booked":
      return {
        label: "Booked",
        bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        dot: "bg-blue-400",
      };
    case "checked_in":
      return {
        label: "Checked In",
        bg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
        dot: "bg-amber-400 animate-pulse",
      };
    case "in_service":
      return {
        label: "In Service",
        bg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        dot: "bg-emerald-400 animate-ping",
      };
    case "completed":
      return {
        label: "Completed",
        bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        dot: "bg-zinc-400",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-red-500/10 text-red-400 border-red-500/20",
        dot: "bg-red-400",
      };
    case "no_show":
      return {
        label: "No Show",
        bg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        dot: "bg-orange-400",
      };
    case "skipped":
      return {
        label: "Skipped",
        bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        dot: "bg-purple-400",
      };
    default:
      return {
        label: status,
        bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        dot: "bg-zinc-400",
      };
  }
}

export function generateTokenTicketId(tokenNo: number, salonSlug: string, date: string): string {
  const cleanDate = date.replace(/-/g, "").slice(2); // e.g. 261110
  const prefix = salonSlug.slice(0, 3).toUpperCase();
  return `${prefix}-${cleanDate}-${String(tokenNo).padStart(3, "0")}`;
}

