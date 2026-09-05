import { approximateMonthWuxing, yearWuxing } from "@/data/yijing/ganzhi";
import { CAREER_INTERPRETATIONS } from "@/data/yijing/interpretations/career";
import { HEALTH_INTERPRETATIONS } from "@/data/yijing/interpretations/health";
import { RELATIONSHIP_INTERPRETATIONS } from "@/data/yijing/interpretations/relationship";
import { YEARLY_INTERPRETATIONS } from "@/data/yijing/interpretations/yearly";
import { buildChangedHexagram, findHiddenLiuqin } from "./najia";
import { judgeStrength } from "./wuxing";
import type {
  CastResult,
  Domain,
  DivinationReading,
  Gender,
  HexagramLayout,
  LineInfo,
  Liuqin,
} from "./types";

export const DISCLAIMER =
  "本網站內容依傳統六爻納甲命理系統推算，僅供娛樂與自我參考之用，不構成醫療診斷、法律或財務建議，亦不保證任何結果。人生重大決定請諮詢相關專業人士。";

function targetLiuqinFor(domain: Domain, gender: Gender): Liuqin | "世爻" {
  switch (domain) {
    case "career":
      return "官鬼";
    case "relationship":
      return gender === "male" ? "妻財" : "官鬼";
    case "health":
      return "子孫";
    case "yearly":
      return "世爻";
  }
}

/** 在卦中挑選用神爻：優先取世爻本身（若該六親剛好在世爻上）、其次動爻、否則取第一個符合的爻。 */
function pickUseShenLine(hexagram: HexagramLayout, liuqin: Liuqin): LineInfo | undefined {
  const candidates = hexagram.lines.filter((l) => l.liuqin === liuqin);
  if (candidates.length === 0) return undefined;
  const shiMatch = candidates.find((l) => l.isShi);
  if (shiMatch) return shiMatch;
  const movingMatch = candidates.find((l) => l.moving);
  if (movingMatch) return movingMatch;
  return candidates[0];
}

function interpretationBankFor(domain: Domain) {
  switch (domain) {
    case "career":
      return CAREER_INTERPRETATIONS;
    case "relationship":
      return RELATIONSHIP_INTERPRETATIONS;
    case "health":
      return HEALTH_INTERPRETATIONS;
    case "yearly":
      return YEARLY_INTERPRETATIONS;
  }
}

export interface InterpretParams {
  cast: CastResult;
  hexagram: HexagramLayout;
  domain: Domain;
  gender: Gender;
  /** career/relationship/health 用「查詢當下月份」作為旺衰參考；yearly 用「目標年份」 */
  referenceDate?: Date;
  targetYear?: number;
}

export function interpret(params: InterpretParams): DivinationReading {
  const { cast, hexagram, domain, gender } = params;
  const referenceDate = params.referenceDate ?? new Date();

  const changedHexagram = buildChangedHexagram(cast.bits, cast.moving);

  const wanted = targetLiuqinFor(domain, gender);
  let useShenLine: LineInfo;
  if (wanted === "世爻") {
    useShenLine = hexagram.lines.find((l) => l.isShi)!;
  } else {
    const found = pickUseShenLine(hexagram, wanted);
    if (found) {
      useShenLine = found;
    } else {
      const hidden = findHiddenLiuqin(hexagram.palace.name, wanted);
      if (!hidden) {
        // 理論上本宮首卦必含五種六親之一，此分支僅為型別保護
        useShenLine = hexagram.lines.find((l) => l.isShi)!;
      } else {
        useShenLine = hidden;
      }
    }
  }

  const referenceWuxing =
    domain === "yearly" ? yearWuxing(params.targetYear ?? referenceDate.getFullYear()) : approximateMonthWuxing(referenceDate.getMonth() + 1);

  const strength = judgeStrength(useShenLine.wuxing, referenceWuxing);
  const bank = interpretationBankFor(domain);
  const text = bank[strength.tier];

  const hiddenNote = useShenLine.isHidden
    ? `（此爻於本卦中未直接出現，依「${hexagram.palace.name}宮」首卦推算伏神參考。）`
    : "";
  const movingNote = useShenLine.moving ? "此爻為動爻，代表相關事項近期變化較為明顯。" : "";

  return {
    cast,
    hexagram,
    changedHexagram,
    domain,
    useShenLine,
    strength,
    summary: text.summary,
    detail: [text.detail, movingNote, hiddenNote].filter(Boolean).join(" "),
    disclaimer: DISCLAIMER,
  };
}
