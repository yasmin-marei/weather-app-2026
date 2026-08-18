export const weatherCodeMap: Record<
  number,
  { conditionEn: string; conditionAr: string; icon: string }
> = {
  0: { conditionEn: "Clear sky", conditionAr: "صافية", icon: "☀️" },
  1: { conditionEn: "Mostly clear", conditionAr: "صافية غالباً", icon: "🌤️" },
  2: { conditionEn: "Partly cloudy", conditionAr: "غائم جزئياً", icon: "⛅" },
  3: { conditionEn: "Overcast", conditionAr: "غائم", icon: "☁️" },
  45: { conditionEn: "Fog", conditionAr: "ضباب", icon: "🌫️" },
  48: { conditionEn: "Fog", conditionAr: "ضباب", icon: "🌫️" },
  51: { conditionEn: "Light drizzle", conditionAr: "رذاذ خفيف", icon: "🌦️" },
  53: { conditionEn: "Drizzle", conditionAr: "رذاذ", icon: "🌦️" },
  55: { conditionEn: "Heavy drizzle", conditionAr: "رذاذ غزير", icon: "🌦️" },
  61: { conditionEn: "Light rain", conditionAr: "مطر خفيف", icon: "🌧️" },
  63: { conditionEn: "Rain", conditionAr: "مطر", icon: "🌧️" },
  65: { conditionEn: "Heavy rain", conditionAr: "مطر غزير", icon: "🌧️" },
  71: { conditionEn: "Light snow", conditionAr: "ثلج خفيف", icon: "🌨️" },
  73: { conditionEn: "Snow", conditionAr: "ثلج", icon: "🌨️" },
  75: { conditionEn: "Heavy snow", conditionAr: "ثلج غزير", icon: "🌨️" },
  80: { conditionEn: "Rain showers", conditionAr: "زخات مطر", icon: "🌦️" },
  81: { conditionEn: "Rain showers", conditionAr: "زخات مطر", icon: "🌦️" },
  82: { conditionEn: "Violent showers", conditionAr: "زخات عنيفة", icon: "⛈️" },
  95: { conditionEn: "Thunderstorm", conditionAr: "عاصفة رعدية", icon: "⛈️" },
  96: { conditionEn: "Thunderstorm", conditionAr: "عاصفة رعدية", icon: "⛈️" },
  99: { conditionEn: "Thunderstorm", conditionAr: "عاصفة رعدية", icon: "⛈️" },
};

const dayNamesAr = [
  "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت",
];

export function describeWeather(code: number, lang: string) {
  const w = weatherCodeMap[code];
  if (!w) return { condition: lang === "ar" ? "غير معروف" : "Unknown", icon: "🌡️" };
  return {
    condition: lang === "ar" ? w.conditionAr : w.conditionEn,
    icon: w.icon,
  };
}

export function dayName(dateStr: string, lang: string) {
  const date = new Date(dateStr);
  if (lang === "ar") {
    return dayNamesAr[date.getDay()];
  }
  return date.toLocaleDateString("en-US", { weekday: "long" });
}