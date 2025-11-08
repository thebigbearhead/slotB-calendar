import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const APP_TIMEZONE = 'Asia/Bangkok';
const ISO_WITH_OFFSET = "yyyy-MM-dd'T'HH:mm:ssXXX";
const BANGKOK_OFFSET = '+07:00';

const pad = (value) => value.toString().padStart(2, '0');

export const toBangkokDate = (date) => {
  const iso = formatInTimeZone(date, APP_TIMEZONE, ISO_WITH_OFFSET);
  return parseISO(iso);
};

export const getBangkokNow = () => toBangkokDate(new Date());

export const formatInBangkok = (date, formatStr) =>
  formatInTimeZone(date, APP_TIMEZONE, formatStr);

export const getBangkokDateString = (date = new Date()) =>
  formatInBangkok(date, 'yyyy-MM-dd');

export const parseToBangkok = (dateString) =>
  parseISO(`${dateString}T00:00:00${BANGKOK_OFFSET}`);

export const getBangkokYearMonth = (date) => ({
  year: Number.parseInt(formatInBangkok(date, 'yyyy'), 10),
  monthIndex: Number.parseInt(formatInBangkok(date, 'M'), 10) - 1,
});

export const makeBangkokDate = (year, monthIndex, day = 1) => {
  const month = pad(monthIndex + 1);
  const dayStr = pad(day);
  return parseISO(`${year}-${month}-${dayStr}T00:00:00${BANGKOK_OFFSET}`);
};

export const shiftBangkokMonth = (date, delta) => {
  const { year, monthIndex } = getBangkokYearMonth(date);
  const totalMonths = year * 12 + monthIndex + delta;
  const newYear = Math.floor(totalMonths / 12);
  const newMonthIndex = ((totalMonths % 12) + 12) % 12;
  return makeBangkokDate(newYear, newMonthIndex);
};
