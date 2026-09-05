// 核心型別定義：陰陽爻、天干地支、五行、六親、八卦、六爻卦

export type YinYang = 0 | 1; // 0 = 陰(斷), 1 = 陽(連)

/** 六爻由下而上，index 0 = 初爻, index 5 = 上爻 */
export type SixLines = [YinYang, YinYang, YinYang, YinYang, YinYang, YinYang];

/** 對應每一爻是否為動爻（老陽/老陰，會變） */
export type SixMoving = [boolean, boolean, boolean, boolean, boolean, boolean];

export const HEAVENLY_STEMS = [
  "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸",
] as const;
export type HeavenlyStem = (typeof HEAVENLY_STEMS)[number];

export const EARTHLY_BRANCHES = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥",
] as const;
export type EarthlyBranch = (typeof EARTHLY_BRANCHES)[number];

export type Wuxing = "木" | "火" | "土" | "金" | "水";

export type Liuqin = "父母" | "兄弟" | "子孫" | "妻財" | "官鬼";

export type TrigramName = "乾" | "兌" | "離" | "震" | "巽" | "坎" | "艮" | "坤";

export interface Trigram {
  name: TrigramName;
  /** 由下而上三爻, 1=陽 0=陰 */
  bits: [YinYang, YinYang, YinYang];
  wuxing: Wuxing;
  attribute: string; // 卦象徵義，例如「天」「澤」
  family: string; // 家人象徵，例如「父」「長女」
}

/** 問卦領域：對應六親用神 */
export type Domain = "career" | "relationship" | "health" | "yearly";

export type Gender = "male" | "female";

/** 單一爻的完整排盤資訊（納甲＋六親＋世應＋動爻） */
export interface LineInfo {
  position: number; // 1~6
  yinYang: YinYang;
  moving: boolean;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  wuxing: Wuxing;
  liuqin: Liuqin;
  isShi: boolean;
  isYing: boolean;
  /** 若此爻六親為伏神（本宮六親缺失時借用），標記為 true */
  isHidden?: boolean;
}

export interface PalaceInfo {
  name: TrigramName; // 宮名，例如「乾宮」的乾
  wuxing: Wuxing;
}

export type Generation =
  | "本宮"
  | "一世"
  | "二世"
  | "三世"
  | "四世"
  | "五世"
  | "遊魂"
  | "歸魂";

export interface HexagramLayout {
  bits: SixLines;
  lowerTrigram: TrigramName;
  upperTrigram: TrigramName;
  name: string; // 卦名，例如「乾為天」
  kingWenNumber: number;
  keyword: string; // 簡短白話主題
  palace: PalaceInfo;
  generation: Generation;
  shiPosition: number; // 1~6
  yingPosition: number; // 1~6
  lines: LineInfo[]; // length 6, position 1~6
}

export interface CastResult {
  bits: SixLines;
  moving: SixMoving;
  method: "coins" | "plumBlossomTime" | "birthYearly";
  castAt: string; // ISO timestamp 或描述字串
}

export type StrengthTier = "死" | "囚" | "休" | "相" | "旺";

export interface StrengthResult {
  tier: StrengthTier;
  score: 1 | 2 | 3 | 4 | 5;
  referenceWuxing: Wuxing;
  targetWuxing: Wuxing;
}

export interface DivinationReading {
  cast: CastResult;
  hexagram: HexagramLayout;
  changedHexagram?: HexagramLayout; // 若有動爻，變卦排盤
  domain: Domain;
  useShenLine: LineInfo;
  strength: StrengthResult;
  summary: string;
  detail: string;
  disclaimer: string;
}
