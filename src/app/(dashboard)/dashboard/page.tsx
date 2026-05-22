"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase-client";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import type { Opportunity, DashboardStats } from "@/types";
import { Bookmark, FileText, AlertCircle, Sparkles, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [stats, setStats] = useState<DashboardStats>({ totalSaved: 0, currentlyApplying: 0, deadlinesThisWeek: 0 });
  const [recommended, setRecommended] = useState<Opportunity[]>([]);
  const [deadlines, setDeadlines] = useState<Opportunity[]>([]);
  const [isLoadingRec, setIsLoadingRec] = useState(true);
  const [isLoadingDeadline, setIsLoadingDeadline] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchStats() {
      const { data: saved } = await supabase.from("user_saved_opportunities").select("status, reminder_date").eq("user_id", user!.id);
      if (saved) {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        setStats({
          totalSaved: saved.length,
          currentlyApplying: saved.filter((s) => s.status === "applying").length,
          deadlinesThisWeek: saved.filter((s) => s.reminder_date && new Date(s.reminder_date) >= now && new Date(s.reminder_date) <= nextWeek).length,
        });
      }
    }
    fetchStats();
  }, [user, supabase]);

  useEffect(() => {
    if (!profile) return;
    async function fetchRecommended() {
      setIsLoadingRec(true);
      const { data } = await supabase.from("opportunities").select("*").eq("verification_status", "verified")
        .gte("registration_close_date", new Date().toISOString().split("T")[0])
        .contains("target_levels", [profile!.education_level])
        .order("created_at", { ascending: false }).limit(8);
      if (data) {
        let filtered = data as Opportunity[];
        if (profile!.interests?.length) {
          const interestFiltered = data.filter((opp) => profile!.interests.some((i) => opp.field === i));
          if (interestFiltered.length > 0) filtered = interestFiltered;
        }
        setRecommended(filtered);
      }
      setIsLoadingRec(false);
    }
    fetchRecommended();
  }, [profile, supabase]);

  useEffect(() => {
    async function fetchDeadlines() {
      setIsLoadingDeadline(true);
      const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);
      const { data } = await supabase.from("opportunities").select("*").eq("verification_status", "verified")
        .gte("registration_close_date", new Date().toISOString().split("T")[0])
        .lte("registration_close_date", nextWeek.toISOString().split("T")[0])
        .order("registration_close_date", { ascending: true }).limit(4);
      if (data) setDeadlines(data as Opportunity[]);
      setIsLoadingDeadline(false);
    }
    fetchDeadlines();
  }, [supabase]);

  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Halo, {profile?.full_name?.split(" ")[0] || "Sobat"}! 👋</h1>
        <p className="text-gray-500 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Bookmark size={20} />, label: "Peluang Tersimpan", value: stats.totalSaved, color: "bg-primary-50 text-primary-600" },
          { icon: <FileText size={20} />, label: "Sedang Mendaftar", value: stats.currentlyApplying, color: "bg-amber-50 text-amber-600" },
          { icon: <AlertCircle size={20} />, label: "Deadline Minggu Ini", value: stats.deadlinesThisWeek, color: "bg-red-50 text-red-600" },
        ].map((s, i) => (
          <Card key={i} padding="md">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-2xl font-bold text-gray-900">{s.value}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Sparkles size={20} className="text-amber-500" /> Rekomendasi untuk Kamu</h2>
          <Link href="/dashboard/opportunities" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">Lihat Semua <ChevronRight size={16} /></Link>
        </div>
        {isLoadingRec ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)}</div>
        ) : recommended.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{recommended.slice(0, 4).map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}</div>
        ) : (
          <EmptyState title="Belum ada rekomendasi" description="Lengkapi profil dan minatmu." actionLabel="Jelajahi Peluang" onAction={() => window.location.href = "/dashboard/opportunities"} />
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Clock size={20} className="text-red-500" /> Deadline Minggu Ini</h2>
        </div>
        {isLoadingDeadline ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)}</div>
        ) : deadlines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{deadlines.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}</div>
        ) : (
          <EmptyState icon={<Clock size={40} />} title="Tidak ada deadline mendesak" description="Tidak ada peluang yang tutup dalam 7 hari ke depan." />
        )}
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/dashboard/opportunities?category=Lomba", label: "🏆 Lomba", color: "bg-blue-50 hover:bg-blue-100 text-blue-700" },
          { href: "/dashboard/opportunities?category=Beasiswa", label: "🎓 Beasiswa", color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" },
          { href: "/dashboard/opportunities?category=Magang", label: "💼 Magang", color: "bg-purple-50 hover:bg-purple-100 text-purple-700" },
          { href: "/dashboard/submit", label: "📤 Kirim Peluang", color: "bg-amber-50 hover:bg-amber-100 text-amber-700" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className={`px-4 py-3 rounded-xl font-medium text-sm transition-colors text-center ${link.color}`}>{link.label}</Link>
        ))}
      </div>
    </div>
  );
}