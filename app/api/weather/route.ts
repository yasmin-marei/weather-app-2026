import { NextRequest, NextResponse } from "next/server";

const weatherCodeMap: Record<
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

function describeWeather(code: number, lang: string) {
  const w = weatherCodeMap[code];
  if (!w) return { condition: lang === "ar" ? "غير معروف" : "Unknown", icon: "🌡️" };
  return {
    condition: lang === "ar" ? w.conditionAr : w.conditionEn,
    icon: w.icon,
  };
}

function dayName(dateStr: string, lang: string) {
  const date = new Date(dateStr);
  if (lang === "ar") {
    return dayNamesAr[date.getDay()];
  }
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const weatherCache = new Map<string, CacheEntry>();

function getCacheKey(city: string, lang: string) {
  return `${city.trim().toLowerCase()}|${lang}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  if (!city || city.trim() === "") {
    return NextResponse.json(
      { error: lang === "ar" ? "اسم المدينة مطلوب" : "City parameter is required" },
      { status: 400 }
    );
  }

  const cacheKey = getCacheKey(city, lang);
  const cached = weatherCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: { "X-Cache": "HIT" },
    });
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city.trim()
      )}&count=1&language=${lang}&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json(
        { error: lang === "ar" ? "المدينة غير موجودة" : "City not found" },
        { status: 404 }
      );
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
    );

    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: lang === "ar" ? "خدمة الطقس غير متاحة" : "Weather service unavailable" },
        { status: 502 }
      );
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current;
    const daily = weatherData.daily;

    const currentWeather = describeWeather(current.weather_code, lang);

    const forecast = daily.time.map((date: string, i: number) => {
      const w = describeWeather(daily.weather_code[i], lang);
      return {
        day: dayName(date, lang),
        high: Math.round(daily.temperature_2m_max[i]),
        low: Math.round(daily.temperature_2m_min[i]),
        condition: w.condition,
        icon: w.icon,
      };
    });

    const result = {
      city: name,
      country,
      temperature: Math.round(current.temperature_2m),
      condition: currentWeather.condition,
      icon: currentWeather.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      feelsLike: Math.round(current.apparent_temperature),
      forecast,
    };

    weatherCache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(result, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: lang === "ar" ? "فشل تحميل بيانات الطقس" : "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
