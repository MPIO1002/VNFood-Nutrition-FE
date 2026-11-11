export type Month =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type Day =
  | `0${Exclude<Digit, "0">}` // 01-09
  | `${"1" | "2"}${Digit}` // 10-29
  | "30"
  | "31";
export type YearMonth = `${number}-${Month}`;
export type YearMonthDay = `${number}-${Month}-${Day}`;
