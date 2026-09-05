import { describe, expect, it } from "vitest";
import { GENERATIONS, HEXAGRAM_META, PALACE_HOSTS } from "../hexagramMeta";
import { HEXAGRAM_LINE_TEXTS } from "../lines";

const ALL_NAMES = PALACE_HOSTS.flatMap((host) => HEXAGRAM_META[host].map((m) => m.name));

describe("HEXAGRAM_LINE_TEXTS", () => {
  it("has exactly 64 entries", () => {
    expect(Object.keys(HEXAGRAM_LINE_TEXTS)).toHaveLength(64);
  });

  it("has no duplicate keys beyond the 64 unique hexagram names", () => {
    expect(new Set(Object.keys(HEXAGRAM_LINE_TEXTS)).size).toBe(64);
  });

  it("every hexagram name in HEXAGRAM_META has a matching entry", () => {
    for (const name of ALL_NAMES) {
      expect(HEXAGRAM_LINE_TEXTS[name], `missing entry for ${name}`).toBeDefined();
    }
  });

  it("has no stray keys that don't correspond to a real hexagram name", () => {
    const nameSet = new Set(ALL_NAMES);
    for (const key of Object.keys(HEXAGRAM_LINE_TEXTS)) {
      expect(nameSet.has(key), `stray key ${key} not found in HEXAGRAM_META`).toBe(true);
    }
  });

  it("every entry has 6 line texts and 6 vernacular texts, all non-empty", () => {
    for (const [name, entry] of Object.entries(HEXAGRAM_LINE_TEXTS)) {
      expect(entry.lines, name).toHaveLength(6);
      expect(entry.linesVernacular, name).toHaveLength(6);
      for (const line of entry.lines) expect(line.length, name).toBeGreaterThan(0);
      for (const v of entry.linesVernacular) expect(v.length, name).toBeGreaterThan(0);
      expect(entry.judgment.length, name).toBeGreaterThan(0);
      expect(entry.judgmentVernacular.length, name).toBeGreaterThan(0);
    }
  });

  it("only 乾為天 and 坤為地 carry 用九／用六", () => {
    for (const [name, entry] of Object.entries(HEXAGRAM_LINE_TEXTS)) {
      if (name === "乾為天" || name === "坤為地") {
        expect(entry.useNineOrSix, name).toBeTruthy();
      } else {
        expect(entry.useNineOrSix, name).toBeUndefined();
      }
    }
  });

  it("乾為天 matches the well-known canonical six lines", () => {
    expect(HEXAGRAM_LINE_TEXTS["乾為天"].lines).toEqual([
      "潛龍勿用。",
      "見龍在田，利見大人。",
      "君子終日乾乾，夕惕若厲，无咎。",
      "或躍在淵，无咎。",
      "飛龍在天，利見大人。",
      "亢龍有悔。",
    ]);
  });

  it("GENERATIONS length matches the 8-per-palace structure used by ALL_NAMES", () => {
    expect(GENERATIONS).toHaveLength(8);
    expect(ALL_NAMES).toHaveLength(64);
  });
});
