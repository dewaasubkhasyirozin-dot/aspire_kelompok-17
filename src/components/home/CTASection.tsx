import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-primary-700 to-primary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Siap Memulai Langkahmu?</h2>
        <p className="text-lg text-primary-100/80 mb-10 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan pelajar Indonesia yang sudah menemukan peluang impian mereka melalui Langkah.id. Gratis, selamanya.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight size={20} />} className="shadow-lg shadow-secondary-500/30">
              Daftar Sekarang — Gratis!
            </Button>
          </Link>
          <Link href="/dashboard/opportunities">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Lihat Peluang
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}