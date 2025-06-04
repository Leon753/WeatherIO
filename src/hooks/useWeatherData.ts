import { useState, useEffect } from 'react';
import { WeatherService } from '../services/weather/weatherService';
import { WeatherForecast } from '../types/index';

export const useWeatherData = (location: string, selectedDay: number) => {
  const [data, setData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const forecast = await WeatherService.getWeatherForecast(location, selectedDay);
        setData(forecast);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location, selectedDay]);

  return {
    firstDay: data?.firstDay,
    secondDay: data?.secondDay,
    loading,
    error,
  };
};
