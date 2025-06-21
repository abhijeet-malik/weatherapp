import React, { useEffect, useState } from "react";
import WeatherBackground from "./components/WeatherBackground";
import {
  convertTemperature,
  getHumidityValue,
  getVisibilityValue,
  getWindDirection,
} from "./components/Helper";
import {
  HumidityIcon,
  SunriseIcon,
  SunsetIcon,
  VisibilityIcon,
  WindIcon,
} from "./components/Icon";

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState("");

  const API_KEY = "fd8addd2e1f2c19920cb2f90aeca1715";

  // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  // https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric
  // http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid=${API_KEY}

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  // FETCHES 5 LOCATIONS SUGGESTIONS FROM API AND UPDATES
  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      setSuggestion(res.ok ? await res.json() : []);
    } catch {
      setSuggestion([]);
    }
  };

  // This will fetch data from URL
  const fetchWeatherData = async (url, name = "") => {
    setError("");
    setWeather(null);

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error((await response.json()).message || "city not found");
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestion([]);
    } catch (error) {
      setError(error.message);
    }
  };

  // This function prevent form validates city and fetches data VIA API Key
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError("Please Enter a Valid City Name");
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
    );
  };

  // this function check weather exist or return an objects
  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  return (
    <div className="min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-xl p-15 max-w-max text-white w-full border-white/75 relative z-10">
          <h1 className="text-4xl font-extrabold text-center mb-6">
            WeatherApp
          </h1>

          {!weather ? (
            <form onSubmit={handleSearch} className="flex flex-col relative">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city or Country"
                className="mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition duration-300"
              />
              {error && <p className="text-red-500">{error}</p>}

              {suggestion.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10">
                  {suggestion.map((s) => (
                    <button
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${s.state ? `, ${s.state}` : ""}`
                        )
                      }
                      className="bg-blue-700 px-4 py-2 text-sm text-left w-full transition-colors"
                    >
                      {s.name}, {s.country} {s.state && ` ${s.state}`}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Get Weather
              </button>
            </form>
          ) : (
            <div className="mt-6 text-center transition-opacity duration-500">
              <button
                onClick={() => {
                  setWeather(null);
                  setCity("");
                }}
                className="mb-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors"
              >
                New Search
              </button>

              {/* CITY NAME AND DATE */}
              <div className="flex flex-col items-center mb-4">
                <h2 className="text-3xl font-bold">{weather.name}</h2>
                <p className="text-sm mt-1">
                  {new Date().toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="mx-auto my-4 animate-bounce"
              />
              <p className="text-4xl">
                {convertTemperature(weather.main.temp, unit)} &deg;{setUnit}
              </p>
              <p className="capitalize">{weather.weather[0].description}</p>

              {/* WEATHER INFO CARDS */}
              <div className="flex flex-wrap justify-around mt-6 gap-4">
                {[
                  [
                    HumidityIcon,
                    "Humidity",
                    `${weather.main.humidity}% (${getHumidityValue(weather.main.humidity)})`,
                  ],
                  [
                    WindIcon,
                    "Wind",
                    `${weather.wind.speed} m/s (${getWindDirection(weather.wind.deg)})`,
                  ],
                  [
                    VisibilityIcon,
                    "Visibility",
                    getVisibilityValue(weather.visibility),
                  ],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* SUNRISE AND SUNSET */}
              <div className="flex flex-wrap justify-around mt-6 gap-4">
                {[
                  [SunriseIcon, "Sunrise", weather.sys.sunrise],
                  [SunsetIcon, "Sunset", weather.sys.sunset],
                ].map(([Icon, label, time]) => (
                  <div key={label} className="flex flex-col items-center m-2">
                    <Icon />
                    <p className="mt-1 font-semibold">{label}</p>
                    <p className="text-sm">
                      {new Date(time * 1000).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm ">
                <p>
                  <strong>Feels Like:</strong>{convertTemperature(weather.main.feels_like, unit)} &deg;{unit}</p>
                  <p>
                    <strong>Pressure:</strong>{weather.main.pressure} hPa</p>
              </div>
            </div>
          )}
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;