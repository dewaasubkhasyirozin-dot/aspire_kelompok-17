import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm mb-8">
            <Sparkles size={16} className="text-amber-400" />
            <span>Platform Kurasi Peluang Terpercaya</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Satu Langkah Menuju{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Prestasi</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100/80 leading-relaxed mb-10 max-w-2xl mx-auto">
            Temukan ribuan peluang lomba & beasiswa terverifikasi untuk pelajar SD hingga kuliah. Semua informasi lengkap dalam satu platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/opportunities">
              <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={20} />} className="shadow-lg shadow-secondary-500/30">
                Jelajahi Peluang
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Daftar Gratis
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-primary-100/60">
            <span>✅ 100% Terverifikasi</span>
            <span>🔒 Data Aman</span>
            <span>🆓 Gratis Selamanya</span>
          </div>
        </div>
      </div>
    </section>
  );
}