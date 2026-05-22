"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Cari peluang..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setLocalValue(value); }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(newValue), 300);
  };

  const handleClear = () => { setLocalValue(""); onChange(""); };

  return (
    <div className="relative">
      <Input value={localValue} onChange={handleChange} placeholder={placeholder}
        leftIcon={<Search size={18} />}
        rightIcon={localValue ? <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button> : undefined}
      />
    </div>
  );
}