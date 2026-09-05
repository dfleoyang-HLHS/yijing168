import type { Generation, TrigramName } from "@/lib/yijing/types";

export interface HexagramMeta {
  name: string;
  kingWenNumber: number;
  keyword: string;
}

/**
 * 八宮卦次序（京房易傳）：每宮 8 卦，依 本宮(八純)→一世→二世→三世→四世→五世→遊魂→歸魂 排列。
 * 此順序與 lib/yijing/najia.ts 的爻變演算法一一對應（已透過乾宮、兌宮等已知卦名交叉驗證）。
 */
export const PALACE_HOSTS: TrigramName[] = ["乾", "坎", "艮", "震", "巽", "離", "坤", "兌"];

export const GENERATIONS: Generation[] = [
  "本宮",
  "一世",
  "二世",
  "三世",
  "四世",
  "五世",
  "遊魂",
  "歸魂",
];

export const SHI_YING_BY_GENERATION: Record<Generation, { shi: number; ying: number }> = {
  本宮: { shi: 6, ying: 3 },
  一世: { shi: 1, ying: 4 },
  二世: { shi: 2, ying: 5 },
  三世: { shi: 3, ying: 6 },
  四世: { shi: 4, ying: 1 },
  五世: { shi: 5, ying: 2 },
  遊魂: { shi: 4, ying: 1 },
  歸魂: { shi: 3, ying: 6 },
};

/** [宮][世代index 0~7] → 卦名資訊 */
export const HEXAGRAM_META: Record<TrigramName, HexagramMeta[]> = {
  乾: [
    { name: "乾為天", kingWenNumber: 1, keyword: "剛健、自強不息" },
    { name: "天風姤", kingWenNumber: 44, keyword: "邂逅、防微杜漸" },
    { name: "天山遯", kingWenNumber: 33, keyword: "退守、明哲保身" },
    { name: "天地否", kingWenNumber: 12, keyword: "阻塞不通、需要忍耐" },
    { name: "風地觀", kingWenNumber: 20, keyword: "觀察、審視大局" },
    { name: "山地剝", kingWenNumber: 23, keyword: "剝落、由盛轉衰" },
    { name: "火地晉", kingWenNumber: 35, keyword: "晉升、漸進向上" },
    { name: "火天大有", kingWenNumber: 14, keyword: "豐收、大有所得" },
  ],
  坎: [
    { name: "坎為水", kingWenNumber: 29, keyword: "險陷、沉著應對" },
    { name: "水澤節", kingWenNumber: 60, keyword: "節制、量入為出" },
    { name: "水雷屯", kingWenNumber: 3, keyword: "草創維艱、循序漸進" },
    { name: "水火既濟", kingWenNumber: 63, keyword: "階段成功、慎防由盛轉衰" },
    { name: "澤火革", kingWenNumber: 49, keyword: "變革、除舊佈新" },
    { name: "雷火豐", kingWenNumber: 55, keyword: "豐盛、把握高峰期" },
    { name: "地火明夷", kingWenNumber: 36, keyword: "受挫隱忍、韜光養晦" },
    { name: "地水師", kingWenNumber: 7, keyword: "統籌調度、紀律為重" },
  ],
  艮: [
    { name: "艮為山", kingWenNumber: 52, keyword: "靜止、按兵不動" },
    { name: "山火賁", kingWenNumber: 22, keyword: "修飾、講究外在形象" },
    { name: "山天大畜", kingWenNumber: 26, keyword: "蓄積實力、厚積薄發" },
    { name: "山澤損", kingWenNumber: 41, keyword: "損己利人、量力而為" },
    { name: "火澤睽", kingWenNumber: 38, keyword: "意見分歧、求同存異" },
    { name: "天澤履", kingWenNumber: 10, keyword: "謹慎行事、如履薄冰" },
    { name: "風澤中孚", kingWenNumber: 61, keyword: "誠信、以誠待人" },
    { name: "風山漸", kingWenNumber: 53, keyword: "循序漸進、穩紮穩打" },
  ],
  震: [
    { name: "震為雷", kingWenNumber: 51, keyword: "震動、提高警覺" },
    { name: "雷地豫", kingWenNumber: 16, keyword: "安樂、預先準備" },
    { name: "雷水解", kingWenNumber: 40, keyword: "化解、鬆綁困局" },
    { name: "雷風恆", kingWenNumber: 32, keyword: "恆久、持之以恆" },
    { name: "地風升", kingWenNumber: 46, keyword: "上升、穩步發展" },
    { name: "水風井", kingWenNumber: 48, keyword: "資源穩定、澤及他人" },
    { name: "澤風大過", kingWenNumber: 28, keyword: "負荷過重、非常時期" },
    { name: "澤雷隨", kingWenNumber: 17, keyword: "順勢而為、隨和應變" },
  ],
  巽: [
    { name: "巽為風", kingWenNumber: 57, keyword: "謙順、深入細緻" },
    { name: "風天小畜", kingWenNumber: 9, keyword: "小有積蓄、暫緩推進" },
    { name: "風火家人", kingWenNumber: 37, keyword: "家庭、內部關係" },
    { name: "風雷益", kingWenNumber: 42, keyword: "增益、互利互惠" },
    { name: "天雷無妄", kingWenNumber: 25, keyword: "順其自然、勿妄動" },
    { name: "火雷噬嗑", kingWenNumber: 21, keyword: "排除障礙、明快決斷" },
    { name: "山雷頤", kingWenNumber: 27, keyword: "養生、言語謹慎" },
    { name: "山風蠱", kingWenNumber: 18, keyword: "積弊、需革除整頓" },
  ],
  離: [
    { name: "離為火", kingWenNumber: 30, keyword: "光明、依附而生" },
    { name: "火山旅", kingWenNumber: 56, keyword: "漂泊、身處異地" },
    { name: "火風鼎", kingWenNumber: 50, keyword: "革新、確立地位" },
    { name: "火水未濟", kingWenNumber: 64, keyword: "尚未完成、仍需努力" },
    { name: "山水蒙", kingWenNumber: 4, keyword: "蒙昧、學習啟蒙" },
    { name: "風水渙", kingWenNumber: 59, keyword: "渙散、需凝聚人心" },
    { name: "天水訟", kingWenNumber: 6, keyword: "爭訟、意見不合" },
    { name: "天火同人", kingWenNumber: 13, keyword: "合作、志同道合" },
  ],
  坤: [
    { name: "坤為地", kingWenNumber: 2, keyword: "包容、厚德載物" },
    { name: "地雷復", kingWenNumber: 24, keyword: "復甦、否極泰來" },
    { name: "地澤臨", kingWenNumber: 19, keyword: "親臨、迎接機會" },
    { name: "地天泰", kingWenNumber: 11, keyword: "順遂、通達安泰" },
    { name: "雷天大壯", kingWenNumber: 34, keyword: "氣勢強盛、戒驕戒躁" },
    { name: "澤天夬", kingWenNumber: 43, keyword: "決斷、當機立斷" },
    { name: "水天需", kingWenNumber: 5, keyword: "等待時機、耐心蓄勢" },
    { name: "水地比", kingWenNumber: 8, keyword: "親近合作、尋求支持" },
  ],
  兌: [
    { name: "兌為澤", kingWenNumber: 58, keyword: "喜悅、溝通" },
    { name: "澤水困", kingWenNumber: 47, keyword: "困頓、資源受限" },
    { name: "澤地萃", kingWenNumber: 45, keyword: "聚合、匯集資源" },
    { name: "澤山咸", kingWenNumber: 31, keyword: "感應、心意相通" },
    { name: "水山蹇", kingWenNumber: 39, keyword: "險阻、行動受挫" },
    { name: "地山謙", kingWenNumber: 15, keyword: "謙遜、低調行事" },
    { name: "雷山小過", kingWenNumber: 62, keyword: "小心行事、勿躁進" },
    { name: "雷澤歸妹", kingWenNumber: 54, keyword: "名分未定、須謹慎" },
  ],
};
