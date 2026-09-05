import type { CastResult, SixLines, SixMoving, YinYang } from "./types";

/**
 * 三枚銅錢法：每爻擲三枚銅錢，正面(陽,值3)反面(陰,值2)，六爻由下而上各擲一次。
 * 總和 6=老陰(動,變陽) 7=少陽(靜) 8=少陰(靜) 9=老陽(動,變陰)。
 * 使用亂數，適合「即時問卦」，每次結果不同。
 */
export function castByCoins(random: () => number = Math.random): CastResult {
  const bits: YinYang[] = [];
  const moving: boolean[] = [];
  for (let i = 0; i < 6; i++) {
    const sum = [0, 0, 0].reduce((acc) => acc + (random() < 0.5 ? 2 : 3), 0);
    if (sum === 6) {
      bits.push(0);
      moving.push(true);
    } else if (sum === 7) {
      bits.push(1);
      moving.push(false);
    } else if (sum === 8) {
      bits.push(0);
      moving.push(false);
    } else {
      bits.push(1);
      moving.push(true);
    }
  }
  return {
    bits: bits as SixLines,
    moving: moving as SixMoving,
    method: "coins",
    castAt: new Date().toISOString(),
  };
}

/**
 * 梅花易數・時間起卦：以問卦當下的西元年月日時數字取模，推算上卦、下卦、動爻。
 * 不使用亂數，只要輸入的時間相同，結果必然相同（可重現）。
 *
 * 規則（邵雍時間起卦法簡化版）：
 * 上卦 = (年支數 + 月 + 日) mod 8 （0 對應 8，即坤）
 * 下卦 = (年支數 + 月 + 日 + 時支數) mod 8
 * 動爻 = (年支數 + 月 + 日 + 時支數) mod 6
 */
export function castByTime(date: Date): CastResult {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hourBranchIndex = hourToBranchIndex(date.getHours());
  const yearBranchIndex = (((year - 4) % 12) + 12) % 12;

  const upperSum = yearBranchIndex + month + day;
  const lowerSum = upperSum + hourBranchIndex;
  const movingSum = lowerSum;

  const upperTrigramIndex = mod(upperSum, 8);
  const lowerTrigramIndex = mod(lowerSum, 8);
  const movingLine = mod(movingSum, 6);

  const lowerBits = trigramIndexToBits(lowerTrigramIndex);
  const upperBits = trigramIndexToBits(upperTrigramIndex);
  const bits = [...lowerBits, ...upperBits] as SixLines;
  const moving = [false, false, false, false, false, false] as SixMoving;
  moving[movingLine] = true;

  return {
    bits,
    moving,
    method: "plumBlossomTime",
    castAt: date.toISOString(),
  };
}

/**
 * 生辰流年起卦（確定性演算法）：以出生年月日時 + 查詢的目標年份推算流年卦。
 * 同一人、同一個查詢年份必得到相同的卦，符合「流年不隨機」的邏輯。
 * 加入出生時辰可讓同年同月同日出生者得到不同的本命起卦基礎。
 *
 * 規則：
 * 上卦 = (出生年支數 + 出生月 + 出生日 + 出生時支數) mod 8　— 代表本命的固定基礎
 * 下卦 = 上卦基礎 + 查詢年支數，再 mod 8　— 隨查詢年份而變動
 * 動爻 = 下卦基礎 mod 6
 *
 * hourBranchIndex 未提供時預設為 0（子時），僅代表出生時辰未知時的簡化處理。
 */
export function castByBirthYearly(
  birthDate: { year: number; month: number; day: number; hourBranchIndex?: number },
  targetYear: number,
): CastResult {
  const birthYearBranchIndex = (((birthDate.year - 4) % 12) + 12) % 12;
  const targetYearBranchIndex = (((targetYear - 4) % 12) + 12) % 12;
  const hourBranchIndex = birthDate.hourBranchIndex ?? 0;

  const upperSum = birthYearBranchIndex + birthDate.month + birthDate.day + hourBranchIndex;
  const lowerSum = upperSum + targetYearBranchIndex;
  const movingSum = lowerSum;

  const upperTrigramIndex = mod(upperSum, 8);
  const lowerTrigramIndex = mod(lowerSum, 8);
  const movingLine = mod(movingSum, 6);

  const lowerBits = trigramIndexToBits(lowerTrigramIndex);
  const upperBits = trigramIndexToBits(upperTrigramIndex);
  const bits = [...lowerBits, ...upperBits] as SixLines;
  const moving = [false, false, false, false, false, false] as SixMoving;
  moving[movingLine] = true;

  return {
    bits,
    moving,
    method: "birthYearly",
    castAt: `${birthDate.year}-${birthDate.month}-${birthDate.day} → ${targetYear}`,
  };
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** 24小時制小時數 → 十二時辰地支 index（子=0...亥=11）。子時橫跨 23:00~00:59。 */
export function hourToBranchIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2);
}

/** 十二時辰下拉選單用的清單：地支 index、名稱、對應時間範圍。 */
export const HOUR_BRANCH_OPTIONS = [
  { index: 0, branch: "子", label: "子時（23:00–00:59）" },
  { index: 1, branch: "丑", label: "丑時（01:00–02:59）" },
  { index: 2, branch: "寅", label: "寅時（03:00–04:59）" },
  { index: 3, branch: "卯", label: "卯時（05:00–06:59）" },
  { index: 4, branch: "辰", label: "辰時（07:00–08:59）" },
  { index: 5, branch: "巳", label: "巳時（09:00–10:59）" },
  { index: 6, branch: "午", label: "午時（11:00–12:59）" },
  { index: 7, branch: "未", label: "未時（13:00–14:59）" },
  { index: 8, branch: "申", label: "申時（15:00–16:59）" },
  { index: 9, branch: "酉", label: "酉時（17:00–18:59）" },
  { index: 10, branch: "戌", label: "戌時（19:00–20:59）" },
  { index: 11, branch: "亥", label: "亥時（21:00–22:59）" },
] as const;

/**
 * 先天八卦數（邵雍梅花易數）：1乾 2兌 3離 4震 5巽 6坎 7艮 8坤（0 視為 8/坤）。
 */
const TRIGRAM_INDEX_BITS: [YinYang, YinYang, YinYang][] = [
  [0, 0, 0], // index0 → 坤 (對應餘數0)
  [1, 1, 1], // 1 乾
  [1, 1, 0], // 2 兌
  [1, 0, 1], // 3 離
  [1, 0, 0], // 4 震
  [0, 1, 1], // 5 巽
  [0, 1, 0], // 6 坎
  [0, 0, 1], // 7 艮
];

function trigramIndexToBits(remainder: number): [YinYang, YinYang, YinYang] {
  return TRIGRAM_INDEX_BITS[remainder];
}
