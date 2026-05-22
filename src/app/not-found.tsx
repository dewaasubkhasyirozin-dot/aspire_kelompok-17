import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="text-center px-4">
          <div className="text-8xl font-extrabold text-primary-200 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/"><Button variant="primary" leftIcon={<Home size={18} />}>Kembali ke Beranda</Button></Link>
            <Link href="/dashboard/opportunities"><Button variant="outline" leftIcon={<ArrowLeft size={18} />}>Jelajahi Peluang</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
