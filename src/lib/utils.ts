// ============================================================
// UTILITY FUNCTIONS — LANGKAH.ID
// ============================================================

import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(inputs.filter(Boolean).join(" "));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return "Sudah ditutup";
  if (diffInDays === 0) return "Tutup hari ini";
  if (diffInDays === 1) return "Tutup besok";
  if (diffInDays <= 7) return `${diffInDays} hari lagi`;
  if (diffInDays <= 30) return `${Math.ceil(diffInDays / 7)} minggu lagi`;
  return formatDate(dateString);
}

export function getRegistrationStatus(closeDate: string): "open" | "closed" {
  const now = new Date();
  const close = new Date(closeDate);
  return now <= close ? "open" : "closed";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function formatNumber(num: number): string {
  return num.toLocaleString("id-ID");
}