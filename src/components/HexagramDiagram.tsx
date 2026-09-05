import type { HexagramLayout } from "@/lib/yijing/types";

function LineBar({ yinYang, moving }: { yinYang: 0 | 1; moving: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-3 w-28 items-center gap-2">
        {yinYang === 1 ? (
          <div className="h-full w-full rounded-sm bg-stone-800" />
        ) : (
          <>
            <div className="h-full w-[45%] rounded-sm bg-stone-800" />
            <div className="h-full w-[45%] rounded-sm bg-stone-800" />
          </>
        )}
      </div>
      {moving && (
        <span className="text-xs font-medium text-rose-600">
          {yinYang === 1 ? "○ 動" : "✕ 動"}
        </span>
      )}
    </div>
  );
}

export function HexagramDiagram({ hexagram }: { hexagram: HexagramLayout }) {
  const linesTopToBottom = [...hexagram.lines].reverse();
  return (
    <div className="inline-flex flex-col gap-2 rounded-lg border border-stone-200 bg-white p-4">
      {linesTopToBottom.map((line) => (
        <div key={line.position} className="flex items-center gap-3">
          <LineBar yinYang={line.yinYang} moving={line.moving} />
          <span className="w-10 text-xs text-stone-500">
            {line.isShi ? "世" : line.isYing ? "應" : ""}
          </span>
          <span className="text-xs text-stone-500">
            {line.stem}
            {line.branch}
            {line.wuxing}
          </span>
          <span className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-700">
            {line.liuqin}
          </span>
        </div>
      ))}
    </div>
  );
}
