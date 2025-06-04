// src/components/ForecastCard.tsx
import React from "react";
import { WiDaySunny, WiCloudy, WiRain } from "react-icons/wi";
import type { IconType } from "react-icons";

type WeatherIcon = "sunny" | "cloudy" | "rainy";

interface ForecastCardProps {
  date: string;
  icon: 'sunny' | 'rainy' | 'cloudy';
  temp: number;
  humidity: number;
  maxRainChance: number;
  selectedRange: { start: string; end: string } | null;
  weatherStats: {
    maxTemp: number;
    minTemp: number;
    maxHumidity: number;
    minHumidity: number;
    maxRainChance: number;
    minRainChance: number;
    maxWind: number;
    minWind: number;
  } | null;
}

// Store icon components (constructors), not JSX elements
const iconMap: Record<WeatherIcon, IconType> = {
  sunny: WiDaySunny,
  cloudy: WiCloudy,
  rainy: WiRain,
};

const ForecastCard: React.FC<ForecastCardProps> = ({
  date,
  icon,
  temp,
  humidity,
  maxRainChance,
  selectedRange,
  weatherStats,
}) => {
  // Cast to a React functional component type so TypeScript treats it as valid JSX
  const Icon = iconMap[icon] as React.FC<{ size?: number }>;

  const getRainRecommendation = (minRain: number, maxRain: number) => {
    if (maxRain >= 50) {
      return "🌧️ High chance of rain - Consider rescheduling outdoor activities";
    } else if (maxRain >= 30) {
      return "🌦️ Moderate chance of rain - Bring an umbrella if going out";
    } else if (maxRain > 0) {
      return "🌤️ Light chance of rain - Outdoor activities should be fine";
    }
    return "☀️ Clear skies - Perfect for outdoor activities";
  };

  const getWindRecommendation = (minWind: number, maxWind: number) => {
    if (maxWind >= 25) {
      return "💨 Strong winds - Consider rescheduling outdoor activities";
    } else if (maxWind >= 15) {
      return "💨 Moderate winds - Be cautious if going out";
    } else if (maxWind > 0) {
      return "💨 Light winds";
    }
    return "🌬️ Calm winds - Perfect for outdoor activities";
  };

  const getTemperatureRecommendation = (minTemp: number, maxTemp: number) => {
    if (minTemp >= 60 && maxTemp <= 75) {
      return "🌡️ Temperatures are favorable";
    } else if (maxTemp > 75) {
      return "🌡️ It might be a bit warm - Stay hydrated if going out";
    } else if (minTemp < 60) {
      return "🌡️ It might be a bit cool - Consider wearing layers";
    }
    return "🌡️ Temperatures are within a comfortable range";
  };

  return (
    <div className="bg-white backdrop-blur-md rounded-2xl shadow-lg p-6 text-black w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center">{date}</h2>

      <div className="flex items-center justify-center my-4">
        <Icon size={48} />
      </div>

      {selectedRange && weatherStats ? (
        <>
          <p className="text-xl text-center font-medium">{weatherStats.minTemp}°F - {weatherStats.maxTemp}°F</p>

          <div className="mt-4 space-y-1 text-center text-sm">
            <p>💧 Humidity: {weatherStats.minHumidity}% - {weatherStats.maxHumidity}%</p>
            <p>🌧️ Rain Chance: {weatherStats.minRainChance}% - {weatherStats.maxRainChance}%</p>
            <p>💨 Wind Speed: {weatherStats.minWind} mph - {weatherStats.maxWind} mph</p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <h3 className="text-sm font-medium text-center mb-3">
              Selected Time Range ({selectedRange.start} - {selectedRange.end})
            </h3>
            <p className="text-sm text-center text-white/90 mt-2">
              {getRainRecommendation(weatherStats.minRainChance, weatherStats.maxRainChance)}
            </p>
            <p className="text-sm text-center text-white/90 mt-2">
              {getWindRecommendation(weatherStats.minWind, weatherStats.maxWind)}
            </p>
            <p className="text-sm text-center text-white/90 mt-2">
              {getTemperatureRecommendation(weatherStats.minTemp, weatherStats.maxTemp)}
            </p>
          </div>
        </>
      ) : (
        <p className="text-center text-sm text-white/70 mt-4">
          Drag on the chart to select a time range to see forecast details
        </p>
      )}
    </div>
  );
};

export default ForecastCard;
