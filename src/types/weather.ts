export interface ForecastHour {
    datetime: string;
    temp: number;
    humidity: number;
    windspeed: number;
    precipprob: number;
    icon: string;
  }
  
  export interface ForecastDay {
    datetime: string;
    temp: number;
    conditions: string;
    icon: string;
    hours: ForecastHour[];
  }
  
  export interface WeatherResponse {
    address: string;
    days: ForecastDay[];
  }
  