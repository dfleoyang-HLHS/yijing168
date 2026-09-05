import { describe, expect, it } from "vitest";
import { controls, deriveLiuqin, generates, judgeStrength } from "../wuxing";

describe("generates / controls", () => {
  it("follows the standard 相生 cycle", () => {
    expect(generates("木", "火")).toBe(true);
    expect(generates("火", "土")).toBe(true);
    expect(generates("土", "金")).toBe(true);
    expect(generates("金", "水")).toBe(true);
    expect(generates("水", "木")).toBe(true);
    expect(generates("木", "土")).toBe(false);
  });

  it("follows the standard 相克 cycle", () => {
    expect(controls("木", "土")).toBe(true);
    expect(controls("土", "水")).toBe(true);
    expect(controls("水", "火")).toBe(true);
    expect(controls("火", "金")).toBe(true);
    expect(controls("金", "木")).toBe(true);
    expect(controls("木", "水")).toBe(false);
  });
});

describe("deriveLiuqin", () => {
  it("我生者子孫 (palace generates line wuxing)", () => {
    expect(deriveLiuqin("水", "金")).toBe("子孫"); // 金生水
  });
  it("生我者父母 (line wuxing generates palace)", () => {
    expect(deriveLiuqin("土", "金")).toBe("父母"); // 土生金
  });
  it("克我者官鬼 (line wuxing controls palace)", () => {
    expect(deriveLiuqin("火", "金")).toBe("官鬼"); // 火克金
  });
  it("我克者妻財 (palace controls line wuxing)", () => {
    expect(deriveLiuqin("木", "金")).toBe("妻財"); // 金克木
  });
  it("比和者兄弟 (same wuxing)", () => {
    expect(deriveLiuqin("金", "金")).toBe("兄弟");
  });
});

describe("judgeStrength", () => {
  it("同我者旺", () => {
    expect(judgeStrength("金", "金").tier).toBe("旺");
  });
  it("我生者相 (reference generates target)", () => {
    expect(judgeStrength("水", "金").tier).toBe("相"); // 金生水
  });
  it("生我者休 (target generates reference)", () => {
    expect(judgeStrength("土", "金").tier).toBe("休"); // 土生金
  });
  it("克我者囚 (target controls reference)", () => {
    expect(judgeStrength("金", "木").tier).toBe("囚"); // 金克木
  });
  it("我克者死 (reference controls target)", () => {
    expect(judgeStrength("木", "金").tier).toBe("死"); // 金克木 → 木是被克的一方
  });
});
