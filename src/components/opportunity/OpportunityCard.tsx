"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn, getRelativeTime, getRegistrationStatus } from "@/lib/utils";
import { CATEGORY_COLORS, type Opportunity, type Category } from "@/types";
import { Bookmark, BookmarkCheck, Clock, Building2, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSaved } from "@/hooks/useSaved";

interface OpportunityCardProps {
  opportunity: Opportunity;
  className?: string;
}

export function OpportunityCard({ opportunity, className }: OpportunityCardProps) {
  const { isAuthenticated } = useAuth();
  const { isOpportunitySaved, saveOpportunity, removeSavedItem, getSavedItem } = useSaved();

  const isSaved = isOpportunitySaved(opportunity.id);
  const savedItem = getSavedItem(opportunity.id);
  const status = getRegistrationStatus(opportunity.registration_close_date);
  const isOpen = status === "open";

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isSaved && savedItem) {
      removeSavedItem(savedItem.id);
    } else {
      saveOpportunity(opportunity.id);
    }
  };

  return (
    <Link href={`/dashboard/opportunities/${opportunity.id}`}>
      <Card hover padding="md" className={cn("h-full flex flex-col", className)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant={
                opportunity.category === "Lomba" ? "blue" :
                opportunity.category === "Beasiswa" ? "green" :
                opportunity.category === "Magang" ? "purple" :
                opportunity.category === "Workshop" ? "amber" : "gray"
              }
              size="sm"
            >
              {opportunity.category}
            </Badge>
            {!isOpen ? <Badge variant="danger" size="sm">Ditutup</Badge> : <Badge variant="success" size="sm">Buka</Badge>}
          </div>
          {isAuthenticated && (
            <button
              onClick={handleSaveClick}
              className={cn(
                "flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 cursor-pointer",
                isSaved ? "text-primary-600 bg-primary-50 hover:bg-primary-100" : "text-gray-400 hover:text-primary-600 hover:bg-gray-50"
              )}
              title={isSaved ? "Hapus dari simpanan" : "Simpan peluang"}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          )}
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 flex-grow">{opportunity.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <Building2 size={14} />
          <span className="truncate">{opportunity.organizer}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm mb-3">
          <Clock size={14} className={isOpen ? "text-amber-500" : "text-red-500"} />
          <span className={cn("font-medium", isOpen ? "text-amber-600" : "text-red-600")}>
            {getRelativeTime(opportunity.registration_close_date)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-gray-50">
          <GraduationCap size={14} className="text-gray-400 mt-0.5" />
          {opportunity.target_levels.slice(0, 3).map((level) => (
            <span key={level} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md">{level}</span>
          ))}
          {opportunity.target_levels.length > 3 && (
            <span className="text-xs text-gray-400">+{opportunity.target_levels.length - 3}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}