import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-extrabold text-white">
                Langkah<span className="text-primary-400">.id</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Platform kurasi peluang lomba & beasiswa terverifikasi untuk pelajar Indonesia.
            </p>
            <p className="text-xs text-gray-500">&copy; {currentYear} Langkah.id. Hak Cipta Dilindungi.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Jelajahi</h4>
            <ul className="space-y-2">
              {[
                { href: "/dashboard/opportunities?category=Lomba", label: "Lomba" },
                { href: "/dashboard/opportunities?category=Beasiswa", label: "Beasiswa" },
                { href: "/dashboard/opportunities?category=Magang", label: "Magang" },
                { href: "/dashboard/opportunities?category=Workshop", label: "Workshop" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Tentang</h4>
            <ul className="space-y-2">
              {["Tentang Kami", "Kontak", "Karir", "Blog"].map((label) => (
                <li key={label}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Bantuan</h4>
            <ul className="space-y-2">
              {["FAQ", "Kebijakan Privasi", "Syarat & Ketentuan", "Panduan Pengguna"].map((label) => (
                <li key={label}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">Satu Langkah Menuju Prestasi 🚀</p>
          <div className="flex items-center gap-3">
            {["Instagram", "Twitter", "YouTube", "Telegram"].map((social) => (
              <span
                key={social}
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer text-xs font-medium"
                title={social}
              >
                {social[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}