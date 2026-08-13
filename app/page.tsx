"use client";

import { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatCard from "./components/StatCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("F");

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0a0a0a] text-white">
      <Header unit={unit} onToggleUnit={toggleUnit} />

      <div className="flex flex-col items-center gap-6 w-full max-w-3xl px-6 py-8">
        <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold">Amman, Jordan</h2>
          <p className="text-gray-400">☀️ Mostly clear with a high of 75°F</p>
        </div>

        <div className="flex gap-4 w-full">
          <StatCard label="Humidity" value="60%" subtext="Cloud" />
          <StatCard label="Wind" value="5 mph" subtext="Wind" />
          <StatCard label="Feels Like" value="72°F" subtext="Thermometer" />
        </div>
      </div>
    </main>
  );
}