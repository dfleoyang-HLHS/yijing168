import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "易經168 | 六爻流年占卜",
  description: "以傳統六爻納甲法起卦，查詢流年運勢、工作、感情、健康的參考解讀。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-stone-200 bg-stone-100 px-4 py-4 text-center text-xs leading-relaxed text-stone-500">
          本網站內容依傳統六爻納甲命理系統推算，僅供娛樂與自我參考之用，
          不構成醫療診斷、法律或財務建議，亦不保證任何結果。人生重大決定請諮詢相關專業人士。
        </footer>
      </body>
    </html>
  );
}
