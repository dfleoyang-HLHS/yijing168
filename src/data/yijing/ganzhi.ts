import { EARTHLY_BRANCHES, HEAVENLY_STEMS, type EarthlyBranch, type HeavenlyStem } from "@/lib/yijing/types";
import { branchWuxing } from "./najiaTable";
import { exactMonthBranch } from "./solarTerms";

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
 * 精算月建：依真實節氣交接日判斷月支（見 solarTerms.ts）。
 * 取代舊版「以國曆月份近似」的簡化演算法。
 */
export function monthBranchAt(date: Date): EarthlyBranch {
  return exactMonthBranch(date);
}

export function monthWuxingAt(date: Date) {
  return branchWuxing(monthBranchAt(date));
}
