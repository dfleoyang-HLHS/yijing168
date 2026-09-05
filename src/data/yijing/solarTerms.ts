import { type EarthlyBranch } from "@/lib/yijing/types";

/**
 * 24 節氣通用近似演算法（以 1900 年 1 月 6 日 2:05 UTC 為基準點，
 * 搭配回歸年長度 365.24219878 日推算），適用約 1900~2100 年，
 * 誤差通常在 1 天以內。此為天文近似公式，非逐年精算星曆，
 * 但已遠比「用國曆月份近似節氣」精確，足供旺衰判斷參考使用。
 *
 * table[n] 為第 n 個節氣（n=0 為小寒）相對基準點的分鐘偏移量，
 * 是這套近似公式的通用常數表。
 */
const TROPICAL_YEAR_MS = 31556925974.7;
const BASE_UTC_MS = Date.UTC(1900, 0, 6, 2, 5);

const TERM_OFFSET_MINUTES = [
  0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343,
  285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758,
];

/** 24 節氣名稱，index0 = 小寒（與 TERM_OFFSET_MINUTES 對應） */
export const SOLAR_TERM_NAMES = [
  "小寒", "大寒", "立春", "雨水", "驚蟄", "春分", "清明", "穀雨",
  "立夏", "小滿", "芒種", "夏至", "小暑", "大暑", "立秋", "處暑",
  "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至",
] as const;

/** 計算西元 year 年、第 termIndex(0~23) 個節氣的日期時間（UTC）。 */
export function solarTermDate(year: number, termIndex: number): Date {
  const ms = TROPICAL_YEAR_MS * (year - 1900) + TERM_OFFSET_MINUTES[termIndex] * 60000 + BASE_UTC_MS;
  return new Date(ms);
}

/**
 * 十二「節」（月建交接點，不含中氣）對應的地支。
 * 每月的月支由「節」起算：立春起寅月、驚蟄起卯月……以此類推，
 * 循環至大雪起子月、小寒起丑月。TERM_OFFSET_MINUTES 中，
 * 「節」恰好都落在偶數 index（0,2,4...22），與「中氣」交錯排列。
 */
const JIE_TERMS: Array<{ termIndex: number; branch: EarthlyBranch }> = [
  { termIndex: 0, branch: "丑" }, // 小寒
  { termIndex: 2, branch: "寅" }, // 立春
  { termIndex: 4, branch: "卯" }, // 驚蟄
  { termIndex: 6, branch: "辰" }, // 清明
  { termIndex: 8, branch: "巳" }, // 立夏
  { termIndex: 10, branch: "午" }, // 芒種
  { termIndex: 12, branch: "未" }, // 小暑
  { termIndex: 14, branch: "申" }, // 立秋
  { termIndex: 16, branch: "酉" }, // 白露
  { termIndex: 18, branch: "戌" }, // 寒露
  { termIndex: 20, branch: "亥" }, // 立冬
  { termIndex: 22, branch: "子" }, // 大雪
];

/**
 * 精算月建：依「節」交接的實際日期時間判斷月支，取代國曆月份近似法。
 * 為避免年初/年末邊界誤判（例如一月上旬尚未到小寒，仍屬前一年的子月），
 * 會同時計算前一年、當年、次年的節氣交接點再判斷落點。
 *
 * 比較時以 UTC 時間為準，未特別處理使用者當地時區（出生時間通常僅提供
 * 年月日時，無時區資訊），屬於已知的簡化之處。
 */
export function exactMonthBranch(date: Date): EarthlyBranch {
  const t = date.getTime();
  const year = date.getUTCFullYear();

  const candidates = [year - 1, year, year + 1].flatMap((y) =>
    JIE_TERMS.map((jie) => ({ time: solarTermDate(y, jie.termIndex).getTime(), branch: jie.branch })),
  );
  candidates.sort((a, b) => a.time - b.time);

  let result: EarthlyBranch = candidates[0].branch;
  for (const c of candidates) {
    if (c.time <= t) result = c.branch;
    else break;
  }
  return result;
}
