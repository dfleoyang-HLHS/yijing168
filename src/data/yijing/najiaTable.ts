import { EARTHLY_BRANCHES, type EarthlyBranch, type HeavenlyStem, type TrigramName } from "@/lib/yijing/types";

/**
 * 京房納甲固定對照表：每個經卦（八卦）作為「內卦」或「外卦」時所配的天干、
 * 起始地支、地支排列方向。此表與卦屬於哪一個六十四卦無關，是固定規則。
 *
 * 驗證方式：依此表推算之乾、坎、艮、震、巽、離、坤、兌內外納甲，
 * 與傳統納甲歌訣（如乾卦：內甲子甲寅甲辰／外壬午壬申壬戌）完全吻合。
 *
 * direction: 1 = 順行（地支每爻 +2 位), -1 = 逆行（每爻 -2 位）
 */
export interface NajiaSpec {
  innerStem: HeavenlyStem;
  innerStartBranch: EarthlyBranch;
  outerStem: HeavenlyStem;
  outerStartBranch: EarthlyBranch;
  direction: 1 | -1;
}

export const NAJIA_TABLE: Record<TrigramName, NajiaSpec> = {
  乾: { innerStem: "甲", innerStartBranch: "子", outerStem: "壬", outerStartBranch: "午", direction: 1 },
  坎: { innerStem: "戊", innerStartBranch: "寅", outerStem: "戊", outerStartBranch: "申", direction: 1 },
  艮: { innerStem: "丙", innerStartBranch: "辰", outerStem: "丙", outerStartBranch: "戌", direction: 1 },
  震: { innerStem: "庚", innerStartBranch: "子", outerStem: "庚", outerStartBranch: "午", direction: 1 },
  巽: { innerStem: "辛", innerStartBranch: "丑", outerStem: "辛", outerStartBranch: "未", direction: -1 },
  離: { innerStem: "己", innerStartBranch: "卯", outerStem: "己", outerStartBranch: "酉", direction: -1 },
  坤: { innerStem: "乙", innerStartBranch: "未", outerStem: "癸", outerStartBranch: "丑", direction: -1 },
  兌: { innerStem: "丁", innerStartBranch: "巳", outerStem: "丁", outerStartBranch: "亥", direction: -1 },
};

/** 依起始地支＋方向，推算內卦或外卦三爻的地支（由下而上） */
export function branchSequence(start: EarthlyBranch, direction: 1 | -1): [EarthlyBranch, EarthlyBranch, EarthlyBranch] {
  const startIdx = EARTHLY_BRANCHES.indexOf(start);
  const step = direction * 2;
  const idx = (n: number) => EARTHLY_BRANCHES[(((startIdx + n * step) % 12) + 12) % 12];
  return [idx(0), idx(1), idx(2)];
}

export function branchWuxing(branch: EarthlyBranch): "木" | "火" | "土" | "金" | "水" {
  switch (branch) {
    case "寅":
    case "卯":
      return "木";
    case "巳":
    case "午":
      return "火";
    case "辰":
    case "戌":
    case "丑":
    case "未":
      return "土";
    case "申":
    case "酉":
      return "金";
    case "子":
    case "亥":
      return "水";
  }
}
