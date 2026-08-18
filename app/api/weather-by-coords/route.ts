import { NextRequest, NextResponse } from "next/server";
import { describeWeather, dayName } from "../../lib/weatherHelpers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  if (!lat || !lon) {
    return NextResponse.json(
      { error: lang === "ar" ? "الإحداثيات مطلوبة" : "Coordinates are required" },
      { status: 400 }
    );
  }

  try {
    const reverseRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=${lang}&format=json`
    );
    const reverseData = await reverseRes.json();
    const place = reverseData.results?.[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
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

    return NextResponse.json({
      city: place?.name || (lang === "ar" ? "موقعك الحالي" : "Your location"),
      country: place?.country || "",
      temperature: Math.round(current.temperature_2m),
      condition: currentWeather.condition,
      icon: currentWeather.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      feelsLike: Math.round(current.apparent_temperature),
      forecast,
    });
  } catch (error) {
    console.error("Weather by coords error:", error);
    return NextResponse.json(
      { error: lang === "ar" ? "فشل تحميل بيانات الطقس" : "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}