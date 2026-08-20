"use client";

import { useState, useEffect } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StatCard from "./components/StatCard";
import ForecastTable from "./components/ForecastTable";
import Footer from "./components/Footer";
import { translations, Lang } from "./translations";

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  forecast: ForecastDay[];
}

type WeatherSource =
  | { type: "city"; city: string }
  | { type: "coords"; lat: number; lon: number };

export default function Home() {
  const [query, setQuery] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [lang, setLang] = useState<Lang>("en");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // هون التتبع الجديد: بنحفظ "كيف" وصلنا لآخر نتيجة ناجحة
  const [lastSource, setLastSource] = useState<WeatherSource | null>(null);

  const t = translations[lang];

  useEffect(() => {
  const stored = localStorage.getItem("recentSearches");
  if (stored) {
    setRecentSearches(JSON.parse(stored));
  }
}, []);

  // دالة موحّدة لجلب الطقس بالمدينة (تستخدم بالبحث اليدوي وإعادة الجلب عند تبديل اللغة)
  const fetchWeatherByCity = async (cityName: string, currentLang: Lang) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}&lang=${currentLang}`
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setWeather(data);
      setStatus("success");
      setLastSource({ type: "city", city: cityName });

      const cityLabel = `${data.city}, ${data.country}`;
      const updated = [
        cityLabel,
        ...recentSearches.filter((c) => c !== cityLabel),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      localStorage.setItem("lastSearchedCity", data.city);
    } catch {
      setErrorMessage("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  // دالة موحّدة لجلب الطقس بالإحداثيات (تستخدم بزر الموقع وإعادة الجلب عند تبديل اللغة)
  const fetchWeatherByCoords = async (
    lat: number,
    lon: number,
    currentLang: Lang
  ) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(
        `/api/weather-by-coords?lat=${lat}&lon=${lon}&lang=${currentLang}`
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || t.locationUnavailable);
        setStatus("error");
        return;
      }

      setWeather(data);
      setStatus("success");
      setQuery(data.city);
      setLastSource({ type: "coords", lat, lon });
    } catch {
      setErrorMessage(t.locationUnavailable);
      setStatus("error");
    }
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    fetchWeatherByCity(trimmed, lang);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage(t.locationUnavailable);
      setStatus("error");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude, lang);
      },
      () => {
        setErrorMessage(t.locationDenied);
        setStatus("error");
      }
    );
  };

  
  useEffect(() => {
    if (!lastSource) return;

    if (lastSource.type === "coords") {
      fetchWeatherByCoords(lastSource.lat, lastSource.lon, lang);
    } else {
      fetchWeatherByCity(lastSource.city, lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

const handleRecentClick = (cityLabel: string) => {
  const cityOnly = cityLabel.split(",")[0].trim();
  fetchWeatherByCity(cityOnly, lang);
};

  const displayTemp = (celsius: number) =>
    unit === "F" ? Math.round((celsius * 9) / 5 + 32) : celsius;

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="flex min-h-screen flex-col items-center bg-[#0a0a0a] text-white"
    >
      <Header
        unit={unit}
        onToggleUnit={toggleUnit}
        lang={lang}
        onToggleLang={toggleLang}
        title={t.title}
      />

      <div className="flex flex-col items-center gap-6 w-full max-w-3xl px-6 py-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          disabled={status === "loading"}
          placeholder={t.searchPlaceholder}
          lang={lang}
          onUseLocation={handleUseLocation}
        />

        {status === "idle" && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <p className="text-gray-500">{t.idleMessage}</p>
            {recentSearches.length > 0 && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-gray-600">{t.recentSearches}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {recentSearches.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleRecentClick(city)}
                      className="rounded-full bg-[#1a1d24] border border-white/10 px-3 py-1 text-sm text-gray-300 hover:bg-white/5"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="h-8 w-8 rounded-full border-2 border-gray-600 border-t-white animate-spin-slow" />
            <p className="text-gray-400">{t.loading}</p>
          </div>
        )}

        {status === "error" && (
          <p className="text-red-400 mt-4">{errorMessage}</p>
        )}

        {status === "success" && weather && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-2xl font-bold">
                {weather.city}, {weather.country}
              </h2>
              <p className="text-gray-400">
                <span className="animate-icon text-xl">{weather.icon}</span>{" "}
                {weather.condition} {t.highOf}{" "}
                {displayTemp(weather.temperature)}°{unit}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 w-full">
              <StatCard label={t.humidity} value={`${weather.humidity}%`} />
              <StatCard
                label={t.wind}
                value={`${weather.windSpeed} ${t.windUnit}`}
              />
              <StatCard
                label={t.feelsLike}
                value={`${displayTemp(weather.feelsLike)}°${unit}`}
              />
            </div>

            <ForecastTable
              title={t.forecastTitle}
              dayLabel={t.day}
              highLowLabel={t.highLow}
              conditionLabel={t.condition}
              days={weather.forecast.map((d) => ({
                ...d,
                high: displayTemp(d.high),
                low: displayTemp(d.low),
              }))}
            />
          </div>
        )}
      </div>

      <Footer text={t.footer} />
    </main>
  );
}