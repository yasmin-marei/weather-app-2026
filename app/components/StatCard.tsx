interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
}

export default function StatCard({ label, value, subtext }: StatCardProps) {
  return (
    <div className="flex-1 rounded-xl bg-[#1a1d24] border border-white/10 p-4 min-w-[140px]">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}