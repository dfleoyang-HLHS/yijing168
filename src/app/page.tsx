"use client";

import { useState } from "react";
import { HexagramDiagram } from "@/components/HexagramDiagram";
import { HexagramJudgment, HexagramLineTexts } from "@/components/HexagramText";
import { buildHexagramLayout } from "@/lib/yijing/najia";
import { HOUR_BRANCH_OPTIONS, castByBirthYearly, castByCoins, castByTime } from "@/lib/yijing/cast";
import { interpret } from "@/lib/yijing/interpret";
import type { DivinationReading, Domain, Gender } from "@/lib/yijing/types";

const DOMAIN_LABELS: Record<Domain, string> = {
  career: "工作事業",
  relationship: "感情婚姻",
  health: "身體健康",
  yearly: "流年總運",
};

const DOMAIN_HINT: Record<Domain, string> = {
  career: "以「官鬼爻」旺衰判斷工作、上司與競爭壓力的走向。",
  relationship: "依性別取「妻財爻」或「官鬼爻」判斷感情對象的狀態。",
  health: "以「子孫爻」旺衰判斷平安與身心狀態（僅供參考，非醫療診斷）。",
  yearly: "依出生年月日時與查詢年份起卦，判斷該年整體運勢（世爻旺衰）。",
};

const currentYear = new Date().getFullYear();

export default function Home() {
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [birthHour, setBirthHour] = useState<string>(""); // "" = 未知，預設以子時計算
  const [gender, setGender] = useState<Gender>("male");
  const [domain, setDomain] = useState<Domain>("yearly");
  const [castMethod, setCastMethod] = useState<"coins" | "time">("coins");
  const [targetYear, setTargetYear] = useState(currentYear);
  const [reading, setReading] = useState<DivinationReading | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parts = birthDate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
      setError("請輸入正確的出生年月日");
      return;
    }
    const [year, month, day] = parts;
    const hourBranchIndex = birthHour === "" ? undefined : Number(birthHour);

    const cast =
      domain === "yearly"
        ? castByBirthYearly({ year, month, day, hourBranchIndex }, targetYear)
        : castMethod === "coins"
          ? castByCoins()
          : castByTime(new Date());

    const hexagram = buildHexagramLayout(cast.bits, cast.moving);
    const result = interpret({
      cast,
      hexagram,
      domain,
      gender,
      targetYear,
      referenceDate: new Date(),
    });
    setReading(result);
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-wide">易經168 · 六爻流年占卜</h1>
        <p className="text-sm text-stone-500">
          以傳統「六爻納甲法（文王卦）」起卦，依問題領域選取用神爻，判斷旺衰後給出解讀。
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-stone-700">出生年月日（西元）</span>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-stone-700">出生時辰</span>
            <select
              value={birthHour}
              onChange={(e) => setBirthHour(e.target.value)}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="">不確定（預設以子時計算）</option>
              {HOUR_BRANCH_OPTIONS.map((h) => (
                <option key={h.index} value={h.index}>
                  {h.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-stone-700">性別（用於感情用神判斷）</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="rounded-md border border-stone-300 px-3 py-2 text-sm"
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-stone-700">想查詢的領域</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(DOMAIN_LABELS) as Domain[]).map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setDomain(d)}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  domain === d
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                }`}
              >
                {DOMAIN_LABELS[d]}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-500">{DOMAIN_HINT[domain]}</p>
        </div>

        {domain === "yearly" ? (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-stone-700">查詢年份</span>
            <input
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(Number(e.target.value))}
              className="w-32 rounded-md border border-stone-300 px-3 py-2 text-sm"
            />
            <span className="text-xs text-stone-500">
              同一人查詢同一年份，起卦結果固定不變。
            </span>
          </label>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-stone-700">起卦方式</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCastMethod("coins")}
                className={`rounded-md border px-3 py-2 text-sm ${
                  castMethod === "coins"
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-300 bg-white text-stone-700"
                }`}
              >
                擲筊／銅錢（每次隨機）
              </button>
              <button
                type="button"
                onClick={() => setCastMethod("time")}
                className={`rounded-md border px-3 py-2 text-sm ${
                  castMethod === "time"
                    ? "border-stone-800 bg-stone-800 text-white"
                    : "border-stone-300 bg-white text-stone-700"
                }`}
              >
                梅花易數・當下時間起卦
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-md bg-stone-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          起卦並解讀
        </button>
      </form>

      {reading && (
        <section className="space-y-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">
              本卦：{reading.hexagram.name}
              <span className="ml-2 text-sm font-normal text-stone-500">
                ({reading.hexagram.palace.name}宮 · {reading.hexagram.generation})
              </span>
            </h2>
            <span className="text-xs text-stone-400">
              起卦方式：
              {reading.cast.method === "coins"
                ? "擲筊／銅錢"
                : reading.cast.method === "plumBlossomTime"
                  ? "梅花易數・時間起卦"
                  : "生辰流年起卦"}
            </span>
          </div>

          <HexagramJudgment hexagram={reading.hexagram} />

          <div className="flex flex-wrap gap-8">
            <div>
              <p className="mb-2 text-sm text-stone-500">卦象（由上而下）</p>
              <HexagramDiagram hexagram={reading.hexagram} />
              <p className="mt-2 text-xs text-stone-400">主題：{reading.hexagram.keyword}</p>
            </div>

            {reading.changedHexagram && (
              <div>
                <p className="mb-2 text-sm text-stone-500">
                  變卦：{reading.changedHexagram.name}
                </p>
                <HexagramDiagram hexagram={reading.changedHexagram} />
                <p className="mt-2 text-xs text-stone-400">
                  主題：{reading.changedHexagram.keyword}
                </p>
                <div className="mt-2 max-w-sm">
                  <HexagramJudgment hexagram={reading.changedHexagram} />
                </div>
              </div>
            )}
          </div>

          <details className="rounded-lg border border-stone-200 p-4">
            <summary className="cursor-pointer text-sm font-medium text-stone-700">
              查看本卦六爻爻辭原文與白話語譯
            </summary>
            <div className="mt-3">
              <HexagramLineTexts
                hexagram={reading.hexagram}
                useShenPosition={reading.useShenLine.position}
              />
            </div>
          </details>

          <div className="space-y-2 rounded-lg bg-stone-50 p-4">
            <p className="text-sm text-stone-600">
              用神：第 {reading.useShenLine.position} 爻（
              {reading.useShenLine.stem}
              {reading.useShenLine.branch}
              {reading.useShenLine.wuxing}・{reading.useShenLine.liuqin}）　旺衰：
              <span className="font-semibold">{reading.strength.tier}</span>
              （對比{reading.strength.referenceWuxing}）
            </p>
            <h3 className="text-base font-semibold text-stone-800">{reading.summary}</h3>
            <p className="text-sm leading-relaxed text-stone-600">{reading.detail}</p>
          </div>

          <p className="border-t border-stone-100 pt-3 text-xs text-stone-400">
            {reading.disclaimer}
          </p>
        </section>
      )}
    </main>
  );
}
