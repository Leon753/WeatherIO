import { HourlyData } from '../types';

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (timeStr: string) => {
  const hour = parseInt(timeStr.split(':')[0]);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}${period}`;
};

export const getVisibleHours = (hours: HourlyData[], currentStartIndex: number): HourlyData[] => {
  // Show exactly 8 hours starting from the current start index
  const endIdx = Math.min(hours.length, currentStartIndex + 8);
  return hours.slice(currentStartIndex, endIdx);
}; 