import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { OpportunityDetail } from "@/components/opportunity/OpportunityDetail";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import type { Opportunity } from "@/types";
import { Home } from "lucide-react";

interface Props { params: Promise<{ id: string }>; }

async function getOpportunity(id: string): Promise<Opportunity | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("opportunities").select("*").eq("id", id).eq("verification_status", "verified").single();
  return data as Opportunity | null;
}

async function getRelated(opportunity: Opportunity, limit = 4): Promise<Opportunity[]> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("opportunities").select("*").eq("verification_status", "verified").eq("category", opportunity.category).neq("id", opportunity.id).order("created_at", { ascending: false }).limit(limit);
  return (data as Opportunity[]) || [];
}

async function incrementView(id: string) {
  const supabase = await createServerSupabase();
  const { data: current } = await supabase.from("opportunities").select("view_count").eq("id", id).single();
  if (current) await supabase.from("opportunities").update({ view_count: (current.view_count || 0) + 1 }).eq("id", id);
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const opp = await getOpportunity(id);
  if (!opp) return { title: "Peluang Tidak Ditemukan" };
  return { title: `${opp.title} — Langkah.id`, description: opp.description.slice(0, 160) };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  const opportunity = await getOpportunity(id);
  if (!opportunity) notFound();

  await incrementView(id);
  const related = await getRelated(opportunity);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-primary-600 transition-colors flex items-center gap-1"><Home size={14} /> Dashboard</Link>
        <span>/</span>
        <Link href="/dashboard/opportunities" className="hover:text-primary-600 transition-colors">Jelajahi</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{opportunity.title}</span>
      </div>
      <OpportunityDetail opportunity={opportunity} />
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Peluang Serupa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((opp) => <OpportunityCard key={opp.id} opportunity={opp} />)}
          </div>
        </section>
      )}
    </div>
  );
}