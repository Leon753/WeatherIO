import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherChart from "./components/weather/WeatherChart";
import ForecastCard from "./components/weather/ForecastCard";
import ChartControls from "./components/weather/ChartControls";
import { useWeatherData } from "./hooks/useWeatherData";
import { DAYS, TIME_PERIODS, TIME_RANGES } from './utils/constants';
import { formatDate, getVisibleHours } from './utils/dateUtils';
import { TimePeriod, HourlyData } from './types';

const App: React.FC = () => {
  const [location, setLocation] = useState<string>("Manhattan, NYC");
  const [selectedDay, setSelectedDay] = useState<number>(5);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("afternoon");
  const [currentStartIndex, setCurrentStartIndex] = useState<number>(0);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
  const { firstDay, secondDay, loading, error } = useWeatherData(location, selectedDay);

  // Reset the start index when the period changes
  useEffect(() => {
    const timeRange = TIME_RANGES[selectedPeriod];
    setCurrentStartIndex(timeRange.start);
  }, [selectedPeriod]);

  // Reset selected range when scrolling occurs
  useEffect(() => {
    setSelectedRange(null);
  }, [currentStartIndex]);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('location') as HTMLInputElement;
    if (input.value.trim()) {
      setLocation(input.value.trim());
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(parseInt(e.target.value));
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value as TimePeriod);
  };

  const handleRangeChange = (range: { start: string; end: string } | null) => {
    setSelectedRange(range);
  };

  const getWeatherStats = (hours: HourlyData[], start: string, end: string) => {
    // Convert time strings to hour indices (0-23)
    const convertTimeToIndex = (timeStr: string): number => {
      if (timeStr.includes('PM')) {
        const hour = parseInt(timeStr.replace('PM', ''));
        return hour === 12 ? 12 : hour + 12;
      } else if (timeStr.includes('AM')) {
        const hour = parseInt(timeStr.replace('AM', ''));
        return hour === 12 ? 0 : hour;
      }
      return parseInt(timeStr);
    };

    const startHour = convertTimeToIndex(start);
    const endHour = convertTimeToIndex(end);

    // Get the hours within the selected range
    const rangeHours = hours.slice(startHour, endHour + 1);

    if (rangeHours.length === 0) {
      return null;
    }

    return {
      maxTemp: Math.max(...rangeHours.map(h => h.temp)),
      minTemp: Math.min(...rangeHours.map(h => h.temp)),
      maxHumidity: Math.max(...rangeHours.map(h => h.humidity)),
      minHumidity: Math.min(...rangeHours.map(h => h.humidity)),
      maxRainChance: Math.max(...rangeHours.map(h => h.precipprob)),
      minRainChance: Math.min(...rangeHours.map(h => h.precipprob)),
      maxWind: Math.max(...rangeHours.map(h => h.windspeed)),
      minWind: Math.min(...rangeHours.map(h => h.windspeed))
    };
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!firstDay || !secondDay) return <p className="text-center mt-20">No data available</p>;

  const firstDayVisibleHours = getVisibleHours(firstDay.hours, currentStartIndex);
  const secondDayVisibleHours = getVisibleHours(secondDay.hours, currentStartIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 p-4 md:p-8 pb-24 md:pb-8">
      <div className="container mx-auto">
        {/* Logo */}
        <div className="absolute top-4 left-4">
          <img 
            src={`${process.env.PUBLIC_URL}/WeatherLogo.png`}
            alt="Weather App Logo" 
            className="h-12 w-auto"
          />
        </div>

        {/* Location Search Form */}
        <form onSubmit={handleLocationSubmit} className="max-w-md mx-auto mb-8 mt-16">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                placeholder="Enter location (e.g., San Francisco, CA)"
                className="flex-1 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={location}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Search
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDay}
                onChange={handleDayChange}
                className="flex-1 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DAYS.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                className="flex-1 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TIME_PERIODS.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* First Day Forecast */}
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <ForecastCard
                date={formatDate(firstDay.datetime)}
                icon={firstDay.icon === "clear-day" ? "sunny" : firstDay.icon === "rain" ? "rainy" : "cloudy"}
                temp={firstDay.temp}
                humidity={firstDay.hours[0].humidity}
                maxRainChance={firstDay ? Math.max(...firstDay.hours.map(h => h.precipprob)) : 0}
                selectedRange={selectedRange}
                weatherStats={selectedRange ? getWeatherStats(firstDay.hours, selectedRange.start, selectedRange.end) : null}
              />
            </div>
            <div className="bg-white/5 rounded-lg p-4 min-h-[600px]">
              <WeatherChart
                labels={firstDayVisibleHours.map((h) => h.datetime)}
                temperatureData={firstDayVisibleHours.map((h) => h.temp)}
                humidityData={firstDayVisibleHours.map((h) => h.humidity)}
                precipitationData={firstDayVisibleHours.map((h) => h.precipprob)}
                windData={firstDayVisibleHours.map((h) => h.windspeed)}
                onTimeRangeChange={setCurrentStartIndex}
                currentStartIndex={currentStartIndex}
                totalHours={firstDay.hours.length + 1}
                selectedRange={selectedRange}
                onRangeChange={handleRangeChange}
              />
            </div>
          </div>

          {/* Second Day Forecast */}
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <ForecastCard
                date={formatDate(secondDay.datetime)}
                icon={secondDay.icon === "clear-day" ? "sunny" : secondDay.icon === "rain" ? "rainy" : "cloudy"}
                temp={secondDay.temp}
                humidity={secondDay.hours[0].humidity}
                maxRainChance={secondDay ? Math.max(...secondDay.hours.map(h => h.precipprob)) : 0}
                selectedRange={selectedRange}
                weatherStats={selectedRange ? getWeatherStats(secondDay.hours, selectedRange.start, selectedRange.end) : null}
              />
            </div>
            <div className="bg-white/5 rounded-lg p-4 min-h-[600px]">
              <WeatherChart
                labels={secondDayVisibleHours.map((h) => h.datetime)}
                temperatureData={secondDayVisibleHours.map((h) => h.temp)}
                humidityData={secondDayVisibleHours.map((h) => h.humidity)}
                precipitationData={secondDayVisibleHours.map((h) => h.precipprob)}
                windData={secondDayVisibleHours.map((h) => h.windspeed)}
                onTimeRangeChange={setCurrentStartIndex}
                currentStartIndex={currentStartIndex}
                totalHours={secondDay.hours.length + 1}
                selectedRange={selectedRange}
                onRangeChange={handleRangeChange}
              />
            </div>
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="md:max-w-6xl md:mx-auto md:mt-4">
          <ChartControls
            totalHours={firstDay ? firstDay.hours.length + 1 : 25}
            currentStartIndex={currentStartIndex}
            onScrollChange={setCurrentStartIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
