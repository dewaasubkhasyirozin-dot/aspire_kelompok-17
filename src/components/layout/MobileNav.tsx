"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Compass, Bookmark, Send } from "lucide-react";

const mobileLinks = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/dashboard/opportunities", label: "Jelajahi", icon: Compass },
  { href: "/dashboard/saved", label: "Simpan", icon: Bookmark },
  { href: "/dashboard/submit", label: "Kirim", icon: Send },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg min-w-[64px] transition-colors",
              isActive(link.href) ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <link.icon size={22} />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}