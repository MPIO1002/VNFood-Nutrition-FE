import { Day, YearMonth, YearMonthDay } from "@/types/date";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateUtils = {
  getFromDateFormat: (date: YearMonthDay | YearMonth) => {
    return date?.split("-");
  },
  toYMDFormat: (d: Date): YearMonthDay => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}` as YearMonthDay;
  },
  toYMFormat: (d: Date): YearMonth => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}` as YearMonth;
  },
  convertYMDFormatToYMFormat: (date: YearMonthDay) => {
    const [y, m, _] = dateUtils.getFromDateFormat(date);
    return `${y}-${m}` as YearMonth;
  },
  convertYMFormatToYMDFormat: (date: YearMonth, day: Day) => {
    const [y, m] = dateUtils.getFromDateFormat(date);
    return `${y}-${m}-${day}` as YearMonthDay;
  },
  convertYMToDate: (date: YearMonth) => {
    const [y, m] = dateUtils.getFromDateFormat(date);
    return new Date(Number(y), Number(m) - 1, 1);
  },
  convertYMDToDate: (date: YearMonthDay) => {
    const [y, m, d] = dateUtils.getFromDateFormat(date);
    return new Date(Number(y), Number(m) - 1, Number(d));
  },
  getMonthLabel: (month: number) => {
    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    const monthLabel =
      isNaN(month) || !monthNames[month - 1]
        ? "Unknown Month"
        : monthNames[month - 1];

    return monthLabel;
  },
  formatTime: (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },
  now: (): YearMonthDay => {
    return dateUtils.toYMDFormat(new Date());
  },
};
