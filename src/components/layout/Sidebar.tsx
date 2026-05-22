"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Compass, Bookmark, Send, ChevronRight } from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/opportunities", label: "Jelajahi Peluang", icon: Compass },
  { href: "/dashboard/saved", label: "Simpan Saya", icon: Bookmark },
  { href: "/dashboard/submit", label: "Kirim Peluang", icon: Send },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-20">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive(link.href)
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <link.icon size={20} className={cn("transition-colors", isActive(link.href) ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600")} />
              {link.label}
              {isActive(link.href) && <ChevronRight size={16} className="ml-auto text-primary-400" />}
            </Link>
          ))}
        </nav>
        <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl">
          <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-2">🔥 Tips</p>
          <p className="text-xs text-primary-800 leading-relaxed">
            Cek halaman Jelajahi setiap hari! Peluang baru selalu kami tambahkan setelah verifikasi.
          </p>
        </div>
      </div>
    </aside>
  );
}