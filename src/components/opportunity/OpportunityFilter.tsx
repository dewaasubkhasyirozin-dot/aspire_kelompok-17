"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, FIELDS, EDUCATION_LEVELS, OPPORTUNITY_TYPES, type OpportunityFilters } from "@/types";
import { RotateCcw, X } from "lucide-react";

interface OpportunityFilterProps {
  filters: OpportunityFilters;
  onFilterChange: (filters: Partial<OpportunityFilters>) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function OpportunityFilter({ filters, onFilterChange, onReset, isMobile = false, onClose }: OpportunityFilterProps) {
  const content = (
    <div className="space-y-6">
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Filter</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
        </div>
      )}
      <button onClick={onReset} className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
        <RotateCcw size={14} /> Reset Filter
      </button>

      {/* Kategori */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors",
              filters.category === cat ? "bg-primary-50 text-primary-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}>
              <input type="radio" name="category" checked={filters.category === cat}
                onChange={() => onFilterChange({ category: filters.category === cat ? null : cat })}
                className="text-primary-600 focus:ring-primary-500" />
              <span className="text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bidang */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Bidang</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {FIELDS.map((field) => (
            <label key={field} className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors",
              filters.field === field ? "bg-secondary-50 text-secondary-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}>
              <input type="radio" name="field" checked={filters.field === field}
                onChange={() => onFilterChange({ field: filters.field === field ? null : field })}
                className="text-secondary-500 focus:ring-secondary-500" />
              <span className="text-sm">{field}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Jenjang */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Jenjang</h4>
        <div className="space-y-2">
          {EDUCATION_LEVELS.map((level) => (
            <label key={level} className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors",
              filters.target_level === level ? "bg-amber-50 text-amber-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            )}>
              <input type="radio" name="target_level" checked={filters.target_level === level}
                onChange={() => onFilterChange({ target_level: filters.target_level === level ? null : level })}
                className="text-amber-500 focus:ring-amber-500" />
              <span className="text-sm">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tipe */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Tipe</h4>
        <div className="flex gap-2">
          {([null, ...OPPORTUNITY_TYPES] as (typeof OPPORTUNITY_TYPES[number] | null)[]).map((type) => (
            <button key={type || "semua"} onClick={() => onFilterChange({ type })}
              className={cn("px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer",
                filters.type === type ? "bg-primary-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100")}>
              {type || "Semua"}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
        <div className="flex gap-2">
          {[{ value: null as const, label: "Semua" }, { value: "open" as const, label: "Masih Buka" }, { value: "closed" as const, label: "Sudah Tutup" }].map((opt) => (
            <button key={opt.label} onClick={() => onFilterChange({ status: opt.value })}
              className={cn("px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer",
                filters.status === opt.value
                  ? opt.value === "open" ? "bg-emerald-600 text-white" : opt.value === "closed" ? "bg-red-600 text-white" : "bg-primary-600 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100")}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">{content}</div>
      </div>
    );
  }

  return content;
}