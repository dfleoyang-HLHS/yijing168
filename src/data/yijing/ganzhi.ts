import { EARTHLY_BRANCHES, HEAVENLY_STEMS, type EarthlyBranch, type HeavenlyStem } from "@/lib/yijing/types";
import { branchWuxing } from "./najiaTable";

/** 西元年 → 干支。1984 = 甲子年 為基準點（(1984-4) % 60 = 0）。 */
export function yearGanzhi(year: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const stemIdx = (((year - 4) % 10) + 10) % 10;
  const branchIdx = (((year - 4) % 12) + 12) % 12;
  return { stem: HEAVENLY_STEMS[stemIdx], branch: EARTHLY_BRANCHES[branchIdx] };
}

export function yearWuxing(year: number) {
  return branchWuxing(yearGanzhi(year).branch);
}

/**
 * 簡化版「月建」：以國曆月份近似農曆節氣月支（寅月≈2月、卯月≈3月...）。
 * 這是簡化演算法，未精算節氣交接日，僅用於粗略的旺衰判斷參考。
 */
export function approximateMonthBranch(gregorianMonth: number): EarthlyBranch {
  const idx = (((gregorianMonth % 12) % 12) + 12) % 12;
  return EARTHLY_BRANCHES[idx];
}

export function approximateMonthWuxing(gregorianMonth: number) {
  return branchWuxing(approximateMonthBranch(gregorianMonth));
}
