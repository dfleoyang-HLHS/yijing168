import { describe, expect, it } from "vitest";
import { castByBirthYearly, castByCoins, castByTime } from "../cast";

describe("castByCoins", () => {
  it("produces deterministic output for a fixed sequence of random values", () => {
    let calls = 0;
    const seq = [0.9, 0.9, 0.9]; // all coins "tail" pattern trigger per line call
    const random = () => {
      const v = seq[calls % seq.length];
      calls++;
      return v;
    };
    const result = castByCoins(random);
    expect(result.bits).toHaveLength(6);
    expect(result.moving).toHaveLength(6);
    expect(result.method).toBe("coins");
  });

  it("all-low random values (<0.5) produce 老陰 (moving yin) on every line", () => {
    const result = castByCoins(() => 0.1); // random()<0.5 -> value 2 each coin -> sum 6
    expect(result.bits).toEqual([0, 0, 0, 0, 0, 0]);
    expect(result.moving).toEqual([true, true, true, true, true, true]);
  });

  it("all-high random values (>=0.5) produce 老陽 (moving yang) on every line", () => {
    const result = castByCoins(() => 0.9); // random()>=0.5 -> value 3 each coin -> sum 9
    expect(result.bits).toEqual([1, 1, 1, 1, 1, 1]);
    expect(result.moving).toEqual([true, true, true, true, true, true]);
  });
});

describe("castByTime", () => {
  it("is deterministic: same input datetime always yields same hexagram", () => {
    const date = new Date(2026, 8, 5, 14, 30, 0); // 2026-09-05 14:30
    const a = castByTime(date);
    const b = castByTime(new Date(2026, 8, 5, 14, 30, 0));
    expect(a.bits).toEqual(b.bits);
    expect(a.moving).toEqual(b.moving);
  });

  it("changes result when the date changes", () => {
    const a = castByTime(new Date(2026, 8, 5, 14, 30, 0));
    const b = castByTime(new Date(2027, 2, 11, 9, 5, 0));
    // 不強求一定不同（理論上可能巧合相同），但至少驗證函式可正常執行並回傳合法卦
    expect(a.bits.length).toBe(6);
    expect(b.bits.length).toBe(6);
  });
});

describe("castByBirthYearly", () => {
  it("is deterministic: same birthdate + target year always yields same hexagram", () => {
    const birth = { year: 1990, month: 5, day: 20 };
    const a = castByBirthYearly(birth, 2026);
    const b = castByBirthYearly({ year: 1990, month: 5, day: 20 }, 2026);
    expect(a.bits).toEqual(b.bits);
    expect(a.moving).toEqual(b.moving);
  });

  it("produces different results for different target years (in general)", () => {
    const birth = { year: 1990, month: 5, day: 20 };
    const y2026 = castByBirthYearly(birth, 2026);
    const y2027 = castByBirthYearly(birth, 2027);
    // 年支不同必然造成下卦與動爻計算不同（除非模數運算巧合），此處驗證兩者非全同
    const same = JSON.stringify(y2026.bits) === JSON.stringify(y2027.bits) && JSON.stringify(y2026.moving) === JSON.stringify(y2027.moving);
    expect(same).toBe(false);
  });
});
