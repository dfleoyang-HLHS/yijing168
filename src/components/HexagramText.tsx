import { HEXAGRAM_LINE_TEXTS } from "@/data/yijing/lines";
import type { HexagramLayout } from "@/lib/yijing/types";

export function HexagramJudgment({ hexagram }: { hexagram: HexagramLayout }) {
  const text = HEXAGRAM_LINE_TEXTS[hexagram.name];
  if (!text) return null;
  return (
    <div className="space-y-1">
      <p className="text-sm text-stone-700">
        <span className="font-medium text-stone-500">卦辭：</span>
        {text.judgment}
      </p>
      <p className="text-xs leading-relaxed text-stone-500">{text.judgmentVernacular}</p>
    </div>
  );
}

export function HexagramLineTexts({
  hexagram,
  useShenPosition,
}: {
  hexagram: HexagramLayout;
  useShenPosition?: number;
}) {
  const text = HEXAGRAM_LINE_TEXTS[hexagram.name];
  if (!text) return null;
  const movingPositions = new Set(hexagram.lines.filter((l) => l.moving).map((l) => l.position));

  return (
    <div className="space-y-2">
      {([1, 2, 3, 4, 5, 6] as const).map((position) => {
        const idx = position - 1;
        const isMoving = movingPositions.has(position);
        const isUseShen = position === useShenPosition;
        return (
          <div
            key={position}
            className={`rounded-md border p-2 text-sm ${
              isUseShen ? "border-stone-800 bg-stone-50" : "border-stone-100"
            }`}
          >
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <span>第 {position} 爻</span>
              {isMoving && <span className="font-medium text-rose-600">動爻</span>}
              {isUseShen && <span className="font-medium text-stone-700">用神</span>}
            </div>
            <p className="text-stone-700">{text.lines[idx]}</p>
            <p className="text-xs leading-relaxed text-stone-500">{text.linesVernacular[idx]}</p>
          </div>
        );
      })}

      {text.useNineOrSix && (
        <div className="rounded-md border border-dashed border-stone-300 p-2 text-sm">
          <p className="mb-1 text-xs text-stone-400">
            {hexagram.name === "乾為天" ? "用九" : "用六"}
          </p>
          <p className="text-stone-700">{text.useNineOrSix}</p>
          <p className="text-xs leading-relaxed text-stone-500">{text.useNineOrSixVernacular}</p>
        </div>
      )}

      {text.note && <p className="text-xs leading-relaxed text-stone-400">＊{text.note}</p>}
    </div>
  );
}
