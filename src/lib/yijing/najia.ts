import { TRIGRAMS, trigramBitsToName } from "@/data/yijing/trigrams";
import { branchSequence, branchWuxing, NAJIA_TABLE } from "@/data/yijing/najiaTable";
import {
  GENERATIONS,
  HEXAGRAM_META,
  PALACE_HOSTS,
  SHI_YING_BY_GENERATION,
} from "@/data/yijing/hexagramMeta";
import { deriveLiuqin } from "./wuxing";
import type {
  Generation,
  HexagramLayout,
  Liuqin,
  LineInfo,
  SixLines,
  SixMoving,
  TrigramName,
  YinYang,
} from "./types";

/**
 * 京房八宮「世代」爻變規則：由本宮(八純)卦起，依序變爻得出一宮八卦。
 * flip 的 index 對應 bits 陣列（0=初爻...5=上爻）。此規則已用乾宮、兌宮等
 * 已知卦名交叉驗證正確（見 hexagramMeta.ts 註解）。
 */
const FLIP_SETS: number[][] = [
  [], // 本宮
  [0], // 一世
  [0, 1], // 二世
  [0, 1, 2], // 三世
  [0, 1, 2, 3], // 四世
  [0, 1, 2, 3, 4], // 五世
  [0, 1, 2, 4], // 遊魂（五世卦的第四爻變回本位）
  [4], // 歸魂（遊魂卦的下卦變回本位，僅第五爻與本宮不同）
];

function flipBits(bits: SixLines, indices: number[]): SixLines {
  const result = [...bits] as SixLines;
  for (const i of indices) result[i] = result[i] === 1 ? 0 : 1;
  return result;
}

interface PalaceHexagramEntry {
  palaceHost: TrigramName;
  generation: Generation;
  generationIndex: number;
  bits: SixLines;
}

function buildAllHexagramEntries(): PalaceHexagramEntry[] {
  const entries: PalaceHexagramEntry[] = [];
  for (const host of PALACE_HOSTS) {
    const hostBits = TRIGRAMS[host].bits;
    const pure = [...hostBits, ...hostBits] as SixLines;
    FLIP_SETS.forEach((flips, genIndex) => {
      entries.push({
        palaceHost: host,
        generation: GENERATIONS[genIndex],
        generationIndex: genIndex,
        bits: flipBits(pure, flips),
      });
    });
  }
  return entries;
}

const ALL_HEXAGRAM_ENTRIES = buildAllHexagramEntries();

function bitsKey(bits: SixLines): string {
  return bits.join("");
}

const ENTRY_BY_BITS = new Map<string, PalaceHexagramEntry>(
  ALL_HEXAGRAM_ENTRIES.map((e) => [bitsKey(e.bits), e]),
);

function lowerBits(bits: SixLines): [YinYang, YinYang, YinYang] {
  return [bits[0], bits[1], bits[2]];
}
function upperBits(bits: SixLines): [YinYang, YinYang, YinYang] {
  return [bits[3], bits[4], bits[5]];
}

type RawLineInfo = Omit<LineInfo, "isShi" | "isYing">;

function buildLines(bits: SixLines, palaceHost: TrigramName, moving?: SixMoving): RawLineInfo[] {
  const lowerName = trigramBitsToName(lowerBits(bits));
  const upperName = trigramBitsToName(upperBits(bits));
  const palaceWuxing = TRIGRAMS[palaceHost].wuxing;

  const lowerSpec = NAJIA_TABLE[lowerName];
  const upperSpec = NAJIA_TABLE[upperName];
  const lowerBranches = branchSequence(lowerSpec.innerStartBranch, lowerSpec.direction);
  const upperBranches = branchSequence(upperSpec.outerStartBranch, upperSpec.direction);

  const lines: RawLineInfo[] = [];
  for (let i = 0; i < 6; i++) {
    const position = i + 1;
    const isLower = i < 3;
    const stem = isLower ? lowerSpec.innerStem : upperSpec.outerStem;
    const branch = isLower ? lowerBranches[i] : upperBranches[i - 3];
    const wuxing = branchWuxing(branch);
    const liuqin = deriveLiuqin(wuxing, palaceWuxing);
    lines.push({
      position,
      yinYang: bits[i],
      moving: moving ? moving[i] : false,
      stem,
      branch,
      wuxing,
      liuqin,
    });
  }
  return lines;
}

/** 依六爻陰陽（由下而上）建立完整排盤：卦名、宮位、世代、世應、納甲、六親。 */
export function buildHexagramLayout(bits: SixLines, moving?: SixMoving): HexagramLayout {
  const entry = ENTRY_BY_BITS.get(bitsKey(bits));
  if (!entry) throw new Error(`Cannot resolve hexagram for bits: ${bits.join("")}`);

  const meta = HEXAGRAM_META[entry.palaceHost][entry.generationIndex];
  const shiYing = SHI_YING_BY_GENERATION[entry.generation];
  const lines = buildLines(bits, entry.palaceHost, moving).map((line) => ({
    ...line,
    isShi: line.position === shiYing.shi,
    isYing: line.position === shiYing.ying,
  }));

  return {
    bits,
    lowerTrigram: trigramBitsToName(lowerBits(bits)),
    upperTrigram: trigramBitsToName(upperBits(bits)),
    name: meta.name,
    kingWenNumber: meta.kingWenNumber,
    keyword: meta.keyword,
    palace: { name: entry.palaceHost, wuxing: TRIGRAMS[entry.palaceHost].wuxing },
    generation: entry.generation,
    shiPosition: shiYing.shi,
    yingPosition: shiYing.ying,
    lines,
  };
}

/** 依動爻，計算變卦（動爻陰陽互換後的新卦，不含動爻標記） */
export function buildChangedHexagram(bits: SixLines, moving: SixMoving): HexagramLayout | undefined {
  if (!moving.some(Boolean)) return undefined;
  const changedBits = bits.map((b, i) => (moving[i] ? (b === 1 ? 0 : 1) : b)) as SixLines;
  return buildHexagramLayout(changedBits);
}

/**
 * 伏神查找：當某六親在目前卦六爻中缺席時，依「本宮首卦」（同宮八純卦）
 * 對應位置尋找該六親的納甲資訊，做為伏神參考。
 */
export function findHiddenLiuqin(
  palaceHost: TrigramName,
  targetLiuqin: Liuqin,
): (LineInfo & { isHidden: true }) | undefined {
  const pureEntry = ENTRY_BY_BITS.get(
    bitsKey([...TRIGRAMS[palaceHost].bits, ...TRIGRAMS[palaceHost].bits] as SixLines),
  );
  if (!pureEntry) return undefined;
  const pureLines = buildLines(pureEntry.bits, palaceHost);
  const shiYing = SHI_YING_BY_GENERATION["本宮"];
  const found = pureLines.find((l) => l.liuqin === targetLiuqin);
  if (!found) return undefined;
  return {
    ...found,
    isShi: found.position === shiYing.shi,
    isYing: found.position === shiYing.ying,
    isHidden: true,
  };
}

export function allHexagramCount(): number {
  return ALL_HEXAGRAM_ENTRIES.length;
}
