import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { SavedProvider } from "@/contexts/SavedContext";
import { ToastProvider } from "@/components/ui/Toast";
import { META } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  keywords: ["lomba", "beasiswa", "magang", "pelajar", "indonesia", "kurasi peluang", "langkah.id"],
  authors: [{ name: "Langkah.id" }],
  openGraph: {
    title: META.title.default,
    description: META.description,
    type: "website",
    locale: "id_ID",
    siteName: "Langkah.id",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <SavedProvider>
            <ToastProvider />
            {children}
          </SavedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}