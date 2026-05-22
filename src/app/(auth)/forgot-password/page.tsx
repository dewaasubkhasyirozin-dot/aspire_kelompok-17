import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = { title: "Lupa Password — Langkah.id" };

export default function ForgotPasswordPage() {
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
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">Lupa Password?</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Masukkan emailmu, kami akan kirim link reset password.</p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}