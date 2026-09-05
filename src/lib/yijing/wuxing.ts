import type { Liuqin, StrengthResult, StrengthTier, Wuxing } from "./types";

const GENERATES: Record<Wuxing, Wuxing> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const CONTROLS: Record<Wuxing, Wuxing> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

/** a 是否生 b */
export function generates(a: Wuxing, b: Wuxing): boolean {
  return GENERATES[a] === b;
}

/** a 是否克 b */
export function controls(a: Wuxing, b: Wuxing): boolean {
  return CONTROLS[a] === b;
}

/**
 * 六親判斷：以卦宮五行為「我」，比較該爻地支五行與宮五行的生克關係。
 * 生我者父母、我生者子孫、克我者官鬼、我克者妻財、比和者兄弟。
 */
export function deriveLiuqin(lineWuxing: Wuxing, palaceWuxing: Wuxing): Liuqin {
  if (lineWuxing === palaceWuxing) return "兄弟";
  if (generates(lineWuxing, palaceWuxing)) return "父母"; // 生我者父母
  if (generates(palaceWuxing, lineWuxing)) return "子孫"; // 我生者子孫
  if (controls(lineWuxing, palaceWuxing)) return "官鬼"; // 克我者官鬼
  if (controls(palaceWuxing, lineWuxing)) return "妻財"; // 我克者妻財
  throw new Error(`Unreachable liuqin combination: ${lineWuxing}/${palaceWuxing}`);
}

const TIER_SCORE: Record<StrengthTier, 1 | 2 | 3 | 4 | 5> = {
  死: 1,
  囚: 2,
  休: 3,
  相: 4,
  旺: 5,
};

/**
 * 簡化版旺相休囚死：以參考五行（月建或流年太歲）為基準「令」，判斷目標爻五行的當令強弱。
 * 同我者旺、我生者相、生我者休、克我者囚、我克者死（此處「我」＝參考五行）。
 */
export function judgeStrength(targetWuxing: Wuxing, referenceWuxing: Wuxing): StrengthResult {
  let tier: StrengthTier;
  if (targetWuxing === referenceWuxing) tier = "旺";
  else if (generates(referenceWuxing, targetWuxing)) tier = "相";
  else if (generates(targetWuxing, referenceWuxing)) tier = "休";
  else if (controls(targetWuxing, referenceWuxing)) tier = "囚";
  else tier = "死"; // referenceWuxing controls targetWuxing

  return {
    tier,
    score: TIER_SCORE[tier],
    referenceWuxing,
    targetWuxing,
  };
}
