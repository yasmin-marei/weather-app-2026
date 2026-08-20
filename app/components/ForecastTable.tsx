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
      <h3 className="text-base sm:text-lg font-bold mb-3 text-start">{title}</h3>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-start text-[10px] sm:text-sm table-fixed">
          <thead>
            <tr className="bg-[#12151c] text-gray-400">
             <th className="px-1 sm:px-4 py-1.5 sm:py-3 font-medium text-start w-[25%]">
  {dayLabel}
</th>
<th className="px-1 sm:px-4 py-1.5 sm:py-3 font-medium text-start w-[30%]">
  {highLowLabel}
</th>
<th className="px-1 sm:px-4 py-1.5 sm:py-3 font-medium text-start w-[25%]">
  {conditionLabel}
</th>
<th className="px-1 sm:px-4 py-1.5 sm:py-3 font-medium text-center w-[20%]"></th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr
                key={d.day}
                className={
                  i !== days.length - 1 ? "border-b border-white/10" : ""
                }
              >
                <td className="px-1 sm:px-4 py-1.5 sm:py-3 font-medium text-white text-start truncate">
                  {d.day}
                </td>
                <td className="px-1 sm:px-4 py-1.5 sm:py-3 text-gray-400 text-start whitespace-nowrap">
                  {d.high}° / {d.low}°
                </td>
                <td className="px-1 sm:px-4 py-1.5 sm:py-3 text-gray-400 text-start truncate">
                  {d.condition}
                </td>
                <td className="px-1 sm:px-4 py-1.5 sm:py-3 text-center text-xs sm:text-lg">
                  {d.icon}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}