import type { Trigram, TrigramName, YinYang } from "@/lib/yijing/types";

/**
 * 八卦基礎資料。bits 由下而上 (index0=初爻/最下)，1=陽(連) 0=陰(斷)。
 * 五行採後天八卦五行（納甲/六親計算標準）：乾兌金、震巽木、坎水、離火、艮坤土。
 */
export const TRIGRAMS: Record<TrigramName, Trigram> = {
  乾: { name: "乾", bits: [1, 1, 1], wuxing: "金", attribute: "天", family: "父" },
  兌: { name: "兌", bits: [1, 1, 0], wuxing: "金", attribute: "澤", family: "少女" },
  離: { name: "離", bits: [1, 0, 1], wuxing: "火", attribute: "火", family: "中女" },
  震: { name: "震", bits: [1, 0, 0], wuxing: "木", attribute: "雷", family: "長男" },
  巽: { name: "巽", bits: [0, 1, 1], wuxing: "木", attribute: "風", family: "長女" },
  坎: { name: "坎", bits: [0, 1, 0], wuxing: "水", attribute: "水", family: "中男" },
  艮: { name: "艮", bits: [0, 0, 1], wuxing: "土", attribute: "山", family: "少男" },
  坤: { name: "坤", bits: [0, 0, 0], wuxing: "土", attribute: "地", family: "母" },
};

export const TRIGRAM_LIST: Trigram[] = Object.values(TRIGRAMS);

export function trigramBitsToName(bits: [YinYang, YinYang, YinYang]): TrigramName {
  const found = TRIGRAM_LIST.find(
    (t) => t.bits[0] === bits[0] && t.bits[1] === bits[1] && t.bits[2] === bits[2],
  );
  if (!found) throw new Error(`Invalid trigram bits: ${bits.join(",")}`);
  return found.name;
}
