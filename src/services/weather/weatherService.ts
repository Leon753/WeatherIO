import { WeatherData } from '../../types/index';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_WEATHER_API_URL;

export class WeatherService {

  public static async getWeatherForecast(location: string, selectedDayOfWeek: number): Promise<{
    firstDay: WeatherData;
    secondDay: WeatherData;
  }> {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0-6, where 0 is Sunday
    
    // If selecting today, use today's date
    if (selectedDayOfWeek === currentDayOfWeek) {
      const todayStr = today.toISOString().split('T')[0];
      const nextWeekDate = new Date(today);
      nextWeekDate.setDate(today.getDate() + 7);

      // Get data for today and next week
      const [todayData, nextWeekData] = await Promise.all([
        this.fetchWeatherData(
          location,
          todayStr,
          todayStr
        ),
        this.fetchWeatherData(
          location,
          nextWeekDate.toISOString().split('T')[0],
          nextWeekDate.toISOString().split('T')[0]
        )
      ]);

      if (!todayData[0] || !nextWeekData[0]) {
        throw new Error('Failed to fetch weather data for today or next week');
      }

      return {
        firstDay: todayData[0],
        secondDay: nextWeekData[0],
      };
    }
    
    // For other days, calculate as before
    let daysUntilSelected = selectedDayOfWeek - currentDayOfWeek;
    if (daysUntilSelected <= 0) {
      daysUntilSelected += 7;
    }

    const firstWeekDate = new Date(today);
    firstWeekDate.setDate(today.getDate() + daysUntilSelected);
    
    const secondWeekDate = new Date(firstWeekDate);
    secondWeekDate.setDate(firstWeekDate.getDate() + 7);

    const [firstWeekData, secondWeekData] = await Promise.all([
      this.fetchWeatherData(
        location,
        firstWeekDate.toISOString().split('T')[0],
        firstWeekDate.toISOString().split('T')[0]
      ),
      this.fetchWeatherData(
        location,
        secondWeekDate.toISOString().split('T')[0],
        secondWeekDate.toISOString().split('T')[0]
      )
    ]);

    if (!firstWeekData[0] || !secondWeekData[0]) {
      throw new Error('Failed to fetch weather data for one or both weeks');
    }

    return {
      firstDay: firstWeekData[0],
      secondDay: secondWeekData[0],
    };
  }  
  private static async fetchWeatherData(location: string, startDate: string, endDate: string): Promise<WeatherData[]> {
    if (!API_KEY) {
      throw new Error('Weather API key is not configured. Please check your .env file.');
    }
    if (!BASE_URL) {
      throw new Error('Weather API key is not configured. Please check your .env file.');
    }

    const url = `${BASE_URL}/${encodeURIComponent(location)}/${startDate}/${endDate}?unitGroup=us&include=hours&key=${API_KEY}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Weather API error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          error: errorText
        });
        throw new Error(`Weather API error (${response.status}): ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Detailed error:', error);
      throw error;
    }
  }

  private static transformWeatherData(data: any): WeatherData[] {
    return data.days.map((day: any) => ({
      datetime: day.datetime,
      temp: day.temp,
      icon: day.icon,
      hours: day.hours.map((hour: any) => ({
        datetime: hour.datetime,
        temp: hour.temp,
        humidity: hour.humidity,
        precipprob: hour.precipprob,
        windspeed: hour.windspeed,
      })),
    }));
  }
} 