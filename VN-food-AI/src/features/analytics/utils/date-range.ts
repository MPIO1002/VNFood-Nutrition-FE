export type AnalyticsPeriod = "week" | "month";

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
  label: string;
  subtitle: string;
  dayCount: number;
}

const toDateParam = (date: Date) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");

const formatDatePart = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

export function getAnalyticsDateRange(
  period: AnalyticsPeriod,
  offset: number,
  now = new Date(),
): AnalyticsDateRange {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (period === "week") {
    const start = new Date(today);
    start.setDate(today.getDate() - ((today.getDay() + 6) % 7) + offset * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const label =
      start.getFullYear() === end.getFullYear()
        ? `${formatDatePart(start)} – ${formatDatePart(end)}/${end.getFullYear()}`
        : `${formatDatePart(start)}/${start.getFullYear()} – ${formatDatePart(end)}/${end.getFullYear()}`;

    return {
      startDate: toDateParam(start),
      endDate: toDateParam(end),
      label,
      subtitle: "Thứ Hai – Chủ Nhật",
      dayCount: 7,
    };
  }

  const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

  return {
    startDate: toDateParam(start),
    endDate: toDateParam(end),
    label: `Tháng ${start.getMonth() + 1}/${start.getFullYear()}`,
    subtitle: `${end.getDate()} ngày`,
    dayCount: end.getDate(),
  };
}