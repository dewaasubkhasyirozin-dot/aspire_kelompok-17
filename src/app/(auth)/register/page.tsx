import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Daftar — Langkah.id",
  description: "Buat akun Langkah.id gratis dan mulai temukan peluang impianmu.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900">Langkah<span className="text-primary-600">.id</span></span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Mulai Langkahmu! 🚀</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Buat akun gratis dan dapatkan rekomendasi peluang terbaik.</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}