import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Convert city name to lat/lon using Open-Meteo's geocoding API
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json(
        { error: "City not found" },
        { status: 404 }
      );
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Fetch current weather + 5-day forecast for those coordinates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
    );
    const weatherData = await weatherRes.json();

    return NextResponse.json({
      city: name,
      country,
      current: weatherData.current,
      daily: weatherData.daily,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}