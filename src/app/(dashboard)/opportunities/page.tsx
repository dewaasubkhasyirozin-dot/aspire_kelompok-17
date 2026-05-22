"use client";

import React, { useState } from "react";
import { OpportunityFilter } from "@/components/opportunity/OpportunityFilter";
import { OpportunityGrid } from "@/components/opportunity/OpportunityGrid";
import { SearchBar } from "@/components/opportunity/SearchBar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useOpportunities } from "@/hooks/useOpportunities";
import type { OpportunityFilters } from "@/types";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OpportunitiesPage() {
  const { opportunities, isLoading, error, totalCount, totalPages, currentPage, filters, setFilters, resetFilters } = useOpportunities();
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const sortOptions = [
    { value: "deadline_terdekat", label: "Deadline Terdekat" },
    { value: "terbaru", label: "Terbaru" },
    { value: "terpopuler", label: "Terpopuler" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Jelajahi Peluang</h1>
        <p className="text-gray-500 mt-1">{totalCount > 0 ? `Menampilkan ${totalCount} peluang tersedia` : "Temukan peluang terbaik untukmu"}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <SearchBar value={filters.search} onChange={(search) => setFilters({ search })} placeholder="Cari lomba, beasiswa, magang..." />
        </div>
        <div className="flex gap-2">
          <select value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value as OpportunityFilters["sort"] })}
            className="px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20">
            {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <Button variant="outline" size="md" onClick={() => setShowMobileFilter(true)} className="lg:hidden" leftIcon={<SlidersHorizontal size={16} />}>Filter</Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <OpportunityFilter filters={filters} onFilterChange={(newFilters) => setFilters(newFilters)} onReset={resetFilters} />
        </div>
        <div className="flex-grow space-y-6">
          <OpportunityGrid opportunities={opportunities} isLoading={isLoading} error={error} />
          {totalPages > 1 && !isLoading && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setFilters({ page: currentPage - 1 })} disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"><ChevronLeft size={18} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setFilters({ page })}
                  className={cn("w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer", currentPage === page ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100")}>{page}</button>
              ))}
              <button onClick={() => setFilters({ page: currentPage + 1 })} disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"><ChevronRight size={18} /></button>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showMobileFilter} onClose={() => setShowMobileFilter(false)} title="Filter Peluang" size="lg">
        <OpportunityFilter filters={filters} onFilterChange={(newFilters) => setFilters(newFilters)} onReset={resetFilters} isMobile onClose={() => setShowMobileFilter(false)} />
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button variant="primary" fullWidth onClick={() => setShowMobileFilter(false)}>Terapkan Filter</Button>
        </div>
      </Modal>
    </div>
  );
}