type Option0 = Pick<Intl.DateTimeFormatOptions, "dateStyle" | "timeStyle" | "timeZoneName">;
type Option1 = Pick<Intl.DateTimeFormatOptions, "year" | "month" | "day" | "weekday">;
type Option2 = Pick<Intl.DateTimeFormatOptions, "hour" | "hour12" | "dayPeriod" | "hourCycle">;
type Option3 = Pick<Intl.DateTimeFormatOptions, "minute" | "second" | "fractionalSecondDigits">;

/** dateStyle: "short" | "medium" | "long" | "full"
 * - short => "12/31/23" / "23. 12. 31."
 * - medium => "Dec 31, 2023" / "2023. 12. 31."
 * - long => "December 31, 2023" / "2023년 12월 31일"
 * - full => "Sunday, December 31, 2023" / "2023년 12월 31일 일요일"
 *
 * timeStyle: "short" | "medium" | "long" | "full"
 * - short => "9:30 AM" / "오전 9:30"
 * - medium => "9:30:15 AM" / "오전 9:30:15"
 * - long => "9:30:15 AM PST" / "오전 9시 30분 15초 PST"
 * - full => "9:30:15 AM Pacific Standard Time" / "오전 9시 30분 15초 태평양 표준시"
 *
 * timeZoneName: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric"
 * - short => "PST" / "KST"
 * - long => "Pacific Standard Time" / "한국 표준시"
 * - shortOffset => "GMT-8" / "GMT+9"
 * - longOffset => "GMT-08:00" / "GMT+09:00"
 * - shortGeneric => "PT" / "KT"
 * - longGeneric => "Pacific Time" / "한국 시간"
 */
export const formatter =
  ({ dateStyle, timeStyle, timeZoneName }: Option0 = {}) =>
  /** year: "numeric" | "2-digit"
   * - numeric => "2023" / "2023"
   * - 2-digit => "23" / "23"
   *
   * month: "numeric" | "2-digit" | "long" | "short" | "narrow"
   * - numeric => "12" / "12"
   * - 2-digit => "12" / "12"
   * - long => "December" / "12월"
   * - short => "Dec" / "12월"
   * - narrow => "D" / "12월"
   *
   * day: "numeric" | "2-digit"
   * - numeric => "31" / "31"
   * - 2-digit => "31" / "31"
   *
   * weekday: "long" | "short" | "narrow"
   * - long => "Sunday" / "일요일"
   * - short => "Sun" / "일"
   * - narrow => "S" / "일"
   */
  ({ year, month, day, weekday }: Option1 = {}) =>
  /** hour: "numeric" | "2-digit"
   * - numeric => "9" / "9"
   * - 2-digit => "09" / "09"
   *
   * hour12: boolean
   * - true => 12시간 형식 (9 AM, 9 PM)
   * - false => 24시간 형식 (09:00, 21:00)
   *
   * dayPeriod: "narrow" | "short" | "long"
   * - narrow => "a" / "오전"
   * - short => "AM" / "오전"
   * - long => "AM" / "오전"
   *
   * hourCycle: "h11" | "h12" | "h23" | "h24"
   * - h11: 0-11 (12시간제, 0시부터)
   * - h12: 1-12 (12시간제, 12시부터)
   * - h23: 0-23 (24시간제, 0시부터)
   * - h24: 1-24 (24시간제, 1시부터)
   */
  ({ hour, hour12, dayPeriod, hourCycle }: Option2 = {}) =>
  /**  minute: "numeric" | "2-digit"
   * - numeric => "5" / "5"
   * - 2-digit => "05" / "05"
   *
   * second: "numeric" | "2-digit"
   * - numeric => "7" / "7"
   * - 2-digit => "07" / "07"
   *
   * fractionalSecondDigits: 0 | 1 | 2 | 3
   * - 0 => 소수점 없음
   * - 1 => "7.1"
   * - 2 => "7.12"
   * - 3 => "7.123"
   */
  ({ minute, second, fractionalSecondDigits }: Option3 = {}) =>
    new Intl.DateTimeFormat(undefined, {
      dateStyle,
      timeStyle,
      timeZoneName,
      year,
      month,
      day,
      weekday,
      hour,
      hour12,
      dayPeriod,
      hourCycle,
      minute,
      second,
      fractionalSecondDigits,
    });
