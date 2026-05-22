import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "danger" | "purple" | "blue" | "green" | "amber" | "gray";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  success: "bg-emerald-100 text-emerald-800 border-emerald-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
  gray: "bg-gray-100 text-gray-700 border-gray-200",
};

const sizeStyles = { sm: "px-2 py-0.5 text-xs", md: "px-3 py-1 text-sm" };

export function Badge({ children, variant = "gray", size = "sm", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center font-medium rounded-full border", variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}