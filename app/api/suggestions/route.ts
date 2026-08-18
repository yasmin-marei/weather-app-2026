import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=5&language=${lang}&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      return NextResponse.json({ results: [] });
    }

    const suggestions = geoData.results.map(
      (r: { name: string; country: string }) => ({
        name: r.name,
        country: r.country,
      })
    );

    return NextResponse.json({ results: suggestions });
  } catch (error) {
    console.error("Suggestions API error:", error);
    return NextResponse.json({ results: [] });
  }
}