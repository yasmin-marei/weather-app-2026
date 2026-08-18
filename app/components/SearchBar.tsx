"use client";

import { useState, useEffect, useRef } from "react";

interface Suggestion {
  name: string;
  country: string;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  lang: "en" | "ar";
  onUseLocation: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Search for a city",
  lang,
  onUseLocation,
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/suggestions?q=${encodeURIComponent(value.trim())}&lang=${lang}`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, lang]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSubmit();
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    setTimeout(() => onSubmit(), 0);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={placeholder}
            className="w-full rounded-lg bg-[#1a1d24] border border-white/10 ps-11 pe-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={onUseLocation}
            disabled={disabled}
            aria-label="Use current location"
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            📍
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full rounded-lg bg-[#1a1d24] border border-white/10 overflow-hidden shadow-lg animate-fade-in">
          {suggestions.map((s, i) => (
            <li key={`${s.name}-${i}`}>
              <button
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-start px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
              >
                {s.name}, {s.country}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}