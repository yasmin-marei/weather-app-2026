"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for a city"
          disabled={disabled}
          aria-label="Search for a city"
          className="w-full rounded-lg bg-[#1a1d24] border border-white/10 pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
    </form>
  );
}