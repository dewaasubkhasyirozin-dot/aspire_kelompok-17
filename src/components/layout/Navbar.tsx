"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import {
  Menu, X, Bell, User, LogOut, ChevronDown,
  Home, Compass, Bookmark, Send,
} from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, profile, signOut, isLoading } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const unauthLinks = [
    { href: "/dashboard/opportunities", label: "Jelajahi Peluang", icon: Compass },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/opportunities", label: "Jelajahi", icon: Compass },
    { href: "/dashboard/saved", label: "Simpan Saya", icon: Bookmark },
    { href: "/dashboard/submit", label: "Kirim Peluang", icon: Send },
  ];

  const links = isAuthenticated ? authLinks : unauthLinks;

  const userDropdownItems = [
    { label: "Profil Saya", icon: <User size={16} />, onClick: () => {} },
    { label: "Keluar", icon: <LogOut size={16} />, onClick: signOut, variant: "danger" as const },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900">
              Langkah<span className="text-primary-600">.id</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-lg" />
            ) : isAuthenticated && user ? (
              <>
                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Bell size={20} />
                </button>
                <DropdownMenu
                  items={userDropdownItems}
                  trigger={
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {profile?.full_name ? getInitials(profile.full_name) : "U"}
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[120px] truncate">
                        {profile?.full_name || "User"}
                      </span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  }
                />
              </>
            ) : (
              <>
                <Link href="/login"><Button variant="ghost" size="sm">Masuk</Button></Link>
                <Link href="/register"><Button variant="primary" size="sm">Daftar Gratis</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && !isLoading && (
              <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-gray-100">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth size="sm">Masuk</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" fullWidth size="sm">Daftar Gratis</Button>
                </Link>
              </div>
            )}
            {isAuthenticated && profile && (
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(profile.full_name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
                    <p className="text-xs text-gray-500">{profile.education_level}</p>
                  </div>
                </div>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 cursor-pointer"
                >
                  <LogOut size={18} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}