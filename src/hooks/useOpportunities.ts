"use client";

// ============================================================
// HOOK: USE OPPORTUNITIES
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";
import type { Opportunity, OpportunityFilters } from "@/types";
import { ITEMS_PER_PAGE } from "@/lib/constants";

interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: OpportunityFilters;
  setFilters: (filters: Partial<OpportunityFilters>) => void;
  resetFilters: () => void;
  refetch: () => void;
}

const defaultFilters: OpportunityFilters = {
  category: null, field: null, target_level: null, type: null,
  status: null, search: "", sort: "deadline_terdekat", page: 1, limit: ITEMS_PER_PAGE,
};

export function useOpportunities(initialFilters?: Partial<OpportunityFilters>): UseOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFiltersState] = useState<OpportunityFilters>({ ...defaultFilters, ...initialFilters });
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const supabase = createClient();

  const setFilters = useCallback((newFilters: Partial<OpportunityFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  }, []);

  const resetFilters = useCallback(() => setFiltersState(defaultFilters), []);
  const refetch = useCallback(() => setRefetchTrigger((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    async function fetchOpportunities() {
      setIsLoading(true);
      setError(null);
      try {
        let query = supabase.from("opportunities").select("*", { count: "exact" }).eq("verification_status", "verified");
        if (filters.category) query = query.eq("category", filters.category);
        if (filters.field) query = query.eq("field", filters.field);
        if (filters.target_level) query = query.contains("target_levels", [filters.target_level]);
        if (filters.type) query = query.eq("type", filters.type);
        if (filters.status === "open") query = query.gte("registration_close_date", new Date().toISOString().split("T")[0]);
        else if (filters.status === "closed") query = query.lt("registration_close_date", new Date().toISOString().split("T")[0]);
        if (filters.search) query = query.or(`title.ilike.%${filters.search}%,organizer.ilike.%${filters.search}%`);

        switch (filters.sort) {
          case "deadline_terdekat": query = query.order("registration_close_date", { ascending: true }); break;
          case "terbaru": query = query.order("created_at", { ascending: false }); break;
          case "terpopuler": query = query.order("view_count", { ascending: false }); break;
        }

        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);

        const { data, count, error } = await query;
        if (error) throw error;
        if (isMounted) { setOpportunities(data as Opportunity[]); setTotalCount(count || 0); }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Gagal memuat peluang");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchOpportunities();
    return () => { isMounted = false; };
  }, [filters, refetchTrigger, supabase]);

  return {
    opportunities, isLoading, error, totalCount,
    totalPages: Math.ceil(totalCount / filters.limit),
    currentPage: filters.page, filters, setFilters, resetFilters, refetch,
  };
}