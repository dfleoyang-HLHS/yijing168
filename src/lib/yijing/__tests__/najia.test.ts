import { describe, expect, it } from "vitest";
import { buildChangedHexagram, buildHexagramLayout, findHiddenLiuqin } from "../najia";
import type { SixLines, SixMoving } from "../types";

describe("buildHexagramLayout", () => {
  it("resolves 乾為天 (all yang) as 乾宮本宮卦 with correct shi/ying and najia", () => {
    const bits: SixLines = [1, 1, 1, 1, 1, 1];
    const layout = buildHexagramLayout(bits);
    expect(layout.name).toBe("乾為天");
    expect(layout.palace.name).toBe("乾");
    expect(layout.generation).toBe("本宮");
    expect(layout.shiPosition).toBe(6);
    expect(layout.yingPosition).toBe(3);
    // 乾為天 六爻納甲：甲子 甲寅 甲辰 壬午 壬申 壬戌
    expect(layout.lines.map((l) => `${l.stem}${l.branch}`)).toEqual([
      "甲子",
      "甲寅",
      "甲辰",
      "壬午",
      "壬申",
      "壬戌",
    ]);
    // 乾宮五行金：金生水(子)=子孫；金克木(寅)=妻財；土生金(辰)=父母；火克金(午)=官鬼；金比和(申)=兄弟；土生金(戌)=父母
    expect(layout.lines.map((l) => l.liuqin)).toEqual([
      "子孫", // 子水：金生水，我生者子孫
      "妻財", // 寅木：金克木，我克者妻財
      "父母", // 辰土：土生金，生我者父母
      "官鬼", // 午火：火克金，克我者官鬼
      "兄弟", // 申金：比和
      "父母", // 戌土：土生金，生我者父母
    ]);
  });

  it("resolves 天風姤 (乾宮一世) with lower trigram 巽 najia", () => {
    // 乾宮一世：初爻變 → 下卦巽(0,1,1) 上卦乾(1,1,1)
    const bits: SixLines = [0, 1, 1, 1, 1, 1];
    const layout = buildHexagramLayout(bits);
    expect(layout.name).toBe("天風姤");
    expect(layout.lowerTrigram).toBe("巽");
    expect(layout.upperTrigram).toBe("乾");
    expect(layout.generation).toBe("一世");
    expect(layout.shiPosition).toBe(1);
    expect(layout.yingPosition).toBe(4);
    // 巽內卦納甲 辛丑辛亥辛酉；乾外卦納甲 壬午壬申壬戌
    expect(layout.lines.map((l) => `${l.stem}${l.branch}`)).toEqual([
      "辛丑",
      "辛亥",
      "辛酉",
      "壬午",
      "壬申",
      "壬戌",
    ]);
  });

  it("resolves 火地晉 (乾宮遊魂) correctly", () => {
    const bits: SixLines = [0, 0, 0, 1, 0, 1];
    const layout = buildHexagramLayout(bits);
    expect(layout.name).toBe("火地晉");
    expect(layout.palace.name).toBe("乾");
    expect(layout.generation).toBe("遊魂");
    expect(layout.shiPosition).toBe(4);
    expect(layout.yingPosition).toBe(1);
  });

  it("resolves 火天大有 (乾宮歸魂) correctly", () => {
    const bits: SixLines = [1, 1, 1, 1, 0, 1];
    const layout = buildHexagramLayout(bits);
    expect(layout.name).toBe("火天大有");
    expect(layout.generation).toBe("歸魂");
    expect(layout.shiPosition).toBe(3);
    expect(layout.yingPosition).toBe(6);
  });

  it("resolves 兌宮 一世/二世 correctly (cross-check different palace)", () => {
    const gen1: SixLines = [0, 1, 0, 1, 1, 0]; // 澤水困
    expect(buildHexagramLayout(gen1).name).toBe("澤水困");
    const gen2: SixLines = [0, 0, 0, 1, 1, 0]; // 澤地萃
    expect(buildHexagramLayout(gen2).name).toBe("澤地萃");
  });

  it("throws on invalid bits combination that is not one of the 64 hexagrams", () => {
    // bits are always valid 0/1 combos, so every 6-bit combination IS one of 64 hexagrams;
    // instead assert total coverage: all 64 combinations resolve without throwing.
    for (let n = 0; n < 64; n++) {
      const bits = Array.from({ length: 6 }, (_, i) => ((n >> i) & 1)) as SixLines;
      expect(() => buildHexagramLayout(bits)).not.toThrow();
    }
  });
});

describe("buildChangedHexagram", () => {
  it("returns undefined when no moving lines", () => {
    const bits: SixLines = [1, 1, 1, 1, 1, 1];
    const moving: SixMoving = [false, false, false, false, false, false];
    expect(buildChangedHexagram(bits, moving)).toBeUndefined();
  });

  it("flips moving lines to build the changed hexagram", () => {
    const bits: SixLines = [1, 1, 1, 1, 1, 1]; // 乾為天
    const moving: SixMoving = [true, false, false, false, false, false];
    const changed = buildChangedHexagram(bits, moving);
    expect(changed?.name).toBe("天風姤");
  });
});

describe("findHiddenLiuqin", () => {
  it("finds the 子孫 line from 乾宮 pure hexagram (乾為天 line1, 甲子)", () => {
    const hidden = findHiddenLiuqin("乾", "子孫");
    expect(hidden).toBeDefined();
    expect(hidden?.isHidden).toBe(true);
    expect(hidden?.liuqin).toBe("子孫");
    expect(hidden?.position).toBe(1);
    expect(`${hidden?.stem}${hidden?.branch}`).toBe("甲子");
  });
});
