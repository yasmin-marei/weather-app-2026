"use client";

import { useCountUp } from "../hooks/useCountUp";

interface StatCardProps {
  label: string;
  value: string;
}

export default function StatCard({ label, value }: StatCardProps) {
  const numericPart = parseInt(value, 10);
  const suffix = value.replace(/^-?\d+/, "");
  const hasNumber = !isNaN(numericPart);

  const animatedNumber = useCountUp(hasNumber ? numericPart : 0);

  return (
    <div className="flex-1 rounded-xl bg-[#1a1d24] border border-white/10 p-3 sm:p-4 text-start transition-all duration-200 hover:scale-105 hover:bg-[#20242e]">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-white mt-1">
        {hasNumber ? `${animatedNumber}${suffix}` : value}
      </p>
    </div>
  );
}