"use client";

import React from "react";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Opportunity } from "@/types";
import { SearchX } from "lucide-react";

interface OpportunityGridProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  error?: string | null;
  skeletonCount?: number;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function OpportunityGrid({
  opportunities, isLoading, error, skeletonCount = 6,
  emptyMessage = "Tidak ada peluang ditemukan",
  emptyDescription = "Coba ubah filter atau kata kunci pencarianmu.",
}: OpportunityGridProps) {
  if (error) {
    return (
      <EmptyState icon={<SearchX size={48} />} title="Oops! Terjadi kesalahan"
        description={error} actionLabel="Coba Lagi" onAction={() => window.location.reload()} />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: skeletonCount }).map((_, i) => <OpportunityCardSkeleton key={i} />)}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return <EmptyState icon={<SearchX size={48} />} title={emptyMessage} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {opportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
    </div>
  );
}