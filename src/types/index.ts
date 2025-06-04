export interface HourlyData {
  datetime: string;
  temp: number;
  humidity: number;
  precipprob: number;
  windspeed: number;
}

export interface WeatherData {
  datetime: string;
  temp: number;
  icon: string;
  hours: HourlyData[];
}

export type TimePeriod = 'early-morning' | 'morning' | 'afternoon' | 'evening';

export interface TimeRange {
  start: number;
  end: number;
  dataStart: number;
  dataEnd: number;
}

export interface WeatherForecast {
  firstDay: WeatherData;
  secondDay: WeatherData;
  thirdDay?: WeatherData;
} 