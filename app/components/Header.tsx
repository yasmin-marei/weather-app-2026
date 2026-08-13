"use client";

interface HeaderProps {
  unit: "C" | "F";
  onToggleUnit: () => void;
}

export default function Header({ unit, onToggleUnit }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10">
      <h1 className="text-lg font-semibold text-white">Weather App</h1>
      <button
        onClick={onToggleUnit}
        aria-label="Toggle temperature unit"
        className="flex items-center gap-1 rounded-lg bg-[#1a1d24] border border-white/10 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/5"
      >
        <span className={unit === "C" ? "text-white font-semibold" : ""}>°C</span>
        <span className="text-gray-500">/</span>
        <span className={unit === "F" ? "text-white font-semibold" : ""}>°F</span>
      </button>
    </header>
  );
}