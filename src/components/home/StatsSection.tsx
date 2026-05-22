"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Layers, ShieldCheck } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: <Trophy size={28} />, value: 100, suffix: "+", label: "Peluang Tersedia" },
  { icon: <Layers size={28} />, value: 10, suffix: "+", label: "Kategori" },
  { icon: <ShieldCheck size={28} />, value: 100, suffix: "%", label: "Terverifikasi" },
];

function useCountUp(target: number, duration: number = 2000, startCounting: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startCounting) return;
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, startCounting]);
  return count;
}

function StatCard({ stat }: { stat: StatItem }) {
  const [isVisible, setIsVisible] = useState(false);
  const count = useCountUp(stat.value, 2000, isVisible);

  return (
    <div
      ref={(el) => {
        if (el && !isVisible) {
          const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.3 });
          observer.observe(el);
        }
      }}
      className="text-center p-6"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl mb-4">{stat.icon}</div>
      <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{count}{stat.suffix}</div>
      <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="relative -mt-10 z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {stats.map((stat, index) => <StatCard key={index} stat={stat} />)}
        </div>
      </div>
    </section>
  );
}