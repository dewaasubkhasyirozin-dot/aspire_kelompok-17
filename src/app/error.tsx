"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-500 rounded-2xl mb-6">
            <AlertTriangle size={36} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Terjadi Kesalahan</h1>
          <p className="text-gray-500 mb-2 max-w-md mx-auto">Maaf, terjadi kesalahan yang tidak terduga.</p>
          {error.digest && <p className="text-xs text-gray-400 mb-6">Kode error: {error.digest}</p>}
          <Button onClick={reset} variant="primary" leftIcon={<RefreshCw size={18} />}>Coba Lagi</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}