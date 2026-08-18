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
      <h3 className="text-lg font-bold mb-3 text-start">{title}</h3>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-start">
          <thead>
            <tr className="bg-[#12151c] text-gray-400 text-sm">
              <th className="px-4 py-3 font-medium text-start">{dayLabel}</th>
              <th className="px-4 py-3 font-medium text-start">{highLowLabel}</th>
              <th className="px-4 py-3 font-medium text-start">{conditionLabel}</th>
              <th className="px-4 py-3 font-medium text-center w-12"></th>
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
                <td className="px-4 py-3 font-medium text-white text-start">
                  {d.day}
                </td>
                <td className="px-4 py-3 text-gray-400 text-start">
                  {d.high}° / {d.low}°
                </td>
                <td className="px-4 py-3 text-gray-400 text-start">
                  {d.condition}
                </td>
                <td className="px-4 py-3 text-center text-lg">{d.icon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}