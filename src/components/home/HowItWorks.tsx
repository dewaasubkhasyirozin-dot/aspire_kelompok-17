import React from "react";
import { cn } from "@/lib/utils";
import { UserPlus, Settings, Trophy } from "lucide-react";

const steps = [
  { number: "01", icon: <UserPlus size={32} />, title: "Daftar Akun", description: "Buat akun gratis dan lengkapi profilmu. Pilih jenjang pendidikan dan bidang yang kamu minati.", color: "bg-primary-50 text-primary-600" },
  { number: "02", icon: <Settings size={32} />, title: "Personalisasi", description: "Dashboard akan menampilkan rekomendasi peluang yang sesuai dengan profil dan minatmu secara otomatis.", color: "bg-secondary-50 text-secondary-600" },
  { number: "03", icon: <Trophy size={32} />, title: "Raih Peluang", description: "Jelajahi, simpan, dan daftar peluang impianmu. Dapatkan reminder sebelum deadline. Raih prestasi!", color: "bg-amber-50 text-amber-600" },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Bagaimana Cara Kerjanya?</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Tiga langkah mudah untuk mulai menemukan dan meraih peluang terbaikmu.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-200" />}
              <div className="relative flex flex-col items-center text-center">
                <div className="absolute -top-3 left-6 text-6xl font-extrabold text-gray-100 select-none">{step.number}</div>
                <div className={cn("relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-sm", step.color)}>{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}