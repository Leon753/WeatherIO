import { TimePeriod } from "../types";
import { TimeRange } from "../types";

export const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const;

export const TIME_PERIODS = [
  { value: 'early-morning', label: 'Early Morning', startHour: 0, endHour: 8 },
  { value: 'morning', label: 'Morning', startHour: 5, endHour: 14 },
  { value: 'afternoon', label: 'Afternoon', startHour: 11, endHour: 20 },
  { value: 'evening', label: 'Evening', startHour: 17, endHour: 24 },
] as const;

export const TIME_RANGES = {
  'early-morning': { start: 0, end: 6, dataStart: 0, dataEnd: 8 },
  'morning': { start: 6, end: 12, dataStart: 5, dataEnd: 14 },
  'afternoon': { start: 12, end: 18, dataStart: 11, dataEnd: 20 },
  'evening': { start: 18, end: 24, dataStart: 17, dataEnd: 25 },
} as const satisfies Record<TimePeriod, TimeRange>; 