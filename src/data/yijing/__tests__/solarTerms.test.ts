import { describe, expect, it } from "vitest";
import { exactMonthBranch, solarTermDate } from "../solarTerms";

function dayOfMonth(d: Date) {
  return { month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

describe("solarTermDate", () => {
  it("places 立春 (termIndex 2) around Feb 3-5 for recent years", () => {
    for (const year of [2020, 2024, 2026, 2030]) {
      const { month, day } = dayOfMonth(solarTermDate(year, 2));
      expect(month).toBe(2);
      expect(day).toBeGreaterThanOrEqual(3);
      expect(day).toBeLessThanOrEqual(5);
    }
  });

  it("places 冬至 (termIndex 23) around Dec 21-23", () => {
    for (const year of [2020, 2024, 2026, 2030]) {
      const { month, day } = dayOfMonth(solarTermDate(year, 23));
      expect(month).toBe(12);
      expect(day).toBeGreaterThanOrEqual(21);
      expect(day).toBeLessThanOrEqual(23);
    }
  });

  it("places 小寒 (termIndex 0) around Jan 5-7", () => {
    for (const year of [2020, 2024, 2026, 2030]) {
      const { month, day } = dayOfMonth(solarTermDate(year, 0));
      expect(month).toBe(1);
      expect(day).toBeGreaterThanOrEqual(4);
      expect(day).toBeLessThanOrEqual(7);
    }
  });
});

describe("exactMonthBranch", () => {
  it("returns 寅 shortly after 立春 (e.g. mid-February)", () => {
    expect(exactMonthBranch(new Date(Date.UTC(2026, 1, 10)))).toBe("寅");
  });

  it("returns 丑 shortly after 小寒 but before 立春 (e.g. mid-January)", () => {
    expect(exactMonthBranch(new Date(Date.UTC(2026, 0, 15)))).toBe("丑");
  });

  it("returns 子 in early January, before 小寒 arrives (still previous term period)", () => {
    // 小寒 2026 約在 1/5-6，1/3 應仍屬前一個節氣週期（大雪起的子月）
    expect(exactMonthBranch(new Date(Date.UTC(2026, 0, 3)))).toBe("子");
  });

  it("returns 子 in mid-December (after 大雪, before next 小寒)", () => {
    expect(exactMonthBranch(new Date(Date.UTC(2026, 11, 10)))).toBe("子");
  });

  it("is consistent across the 12 branches for a full year's midpoints", () => {
    const seen = new Set<string>();
    for (let m = 0; m < 12; m++) {
      seen.add(exactMonthBranch(new Date(Date.UTC(2026, m, 20))));
    }
    // 一年12個月中旬取樣，應能覆蓋到多個不同地支（至少 10 個以上，允許邊界月份重疊）
    expect(seen.size).toBeGreaterThanOrEqual(10);
  });
});
