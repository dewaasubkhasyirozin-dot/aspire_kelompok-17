import React from "react";
import { cn } from "@/lib/utils";
import { Filter, Sparkles, BookmarkCheck, Bell, FileText, Users } from "lucide-react";

const features = [
  { icon: <Filter size={24} />, title: "Filter Granular", description: "Cari peluang berdasarkan kategori, bidang, jenjang, tipe, dan status.", color: "bg-blue-50 text-blue-600" },
  { icon: <Sparkles size={24} />, title: "Personalisasi", description: "Rekomendasi otomatis sesuai jenjang pendidikan dan minat yang kamu pilih.", color: "bg-purple-50 text-purple-600" },
  { icon: <BookmarkCheck size={24} />, title: "Tracker Peluang", description: "Simpan dan lacak status pendaftaranmu: tertarik, sedang daftar, atau selesai.", color: "bg-emerald-50 text-emerald-600" },
  { icon: <Bell size={24} />, title: "Reminder Deadline", description: "Dapatkan notifikasi sebelum pendaftaran ditutup. Tidak ada lagi deadline terlewat.", color: "bg-amber-50 text-amber-600" },
  { icon: <FileText size={24} />, title: "Resource Center", description: "Template CV, tips essay, dan panduan lengkap untuk mempersiapkan pendaftaran.", color: "bg-pink-50 text-pink-600" },
  { icon: <Users size={24} />, title: "Cari Tim", description: "Temukan partner untuk lomba tim. Kolaborasi dengan pelajar dari seluruh Indonesia.", color: "bg-cyan-50 text-cyan-600" },
];

export function FeatureSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Semua yang Kamu Butuhkan dalam <span className="text-primary-600">Satu Platform</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Fitur lengkap untuk membantumu menemukan, melacak, dan meraih setiap peluang.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.color)}>{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}