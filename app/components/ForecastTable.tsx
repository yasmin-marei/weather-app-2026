interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

interface ForecastTableProps {
  days: ForecastDay[];
  title: string;
  dayLabel: string;
  highLowLabel: string;
  conditionLabel: string;
}

export default function ForecastTable({
  days,
  title,
  dayLabel,
  highLowLabel,
  conditionLabel,
}: ForecastTableProps) {
  return (
    <div className="w-full max-w-3xl">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#12151c] text-gray-400 text-sm">
              <th className="px-4 py-3 font-medium">{dayLabel}</th>
              <th className="px-4 py-3 font-medium">{highLowLabel}</th>
              <th className="px-4 py-3 font-medium">{conditionLabel}</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr
                key={d.day}
                className={`text-sm ${
                  i !== days.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-white">{d.day}</td>
                <td className="px-4 py-3 text-gray-400">
                  {d.high}° / {d.low}°
                </td>
                <td className="px-4 py-3 text-gray-400 flex items-center gap-2">
                  {d.condition}
                  <span className="text-lg">{d.icon}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}