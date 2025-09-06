import Header from "~/components/Header";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { useLoading } from "~/contexts/LoadingContext";

// ========= 型 =========
interface AnalysisApiResponse { markdown: string }

interface ChartData { labels: string[]; values: number[] }

// ========= rehype-sanitize: 見出しの id と a の id/href/name を許可 =========
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 || []), ["id", true]],
    h2: [...(defaultSchema.attributes?.h2 || []), ["id", true]],
    h3: [...(defaultSchema.attributes?.h3 || []), ["id", true]],
    h4: [...(defaultSchema.attributes?.h4 || []), ["id", true]],
    h5: [...(defaultSchema.attributes?.h5 || []), ["id", true]],
    h6: [...(defaultSchema.attributes?.h6 || []), ["id", true]],
    a: [
      ...(defaultSchema.attributes?.a || []),
      ["id", true],
      ["href", true],
      ["name", true],
    ],
  },
} as const;

// ========= ユーティリティ =========
/**
 * 見出しの重複を除去する前処理
 * - 同じ見出しテキスト（trim後）が複数回出る場合、最初の1回だけ残す（H1〜H3が対象）
 * - よく重複しがちな定型見出し（要約/重要なキーワード 等）を優先的にユニーク化
 * - 空アンカー <a id="..."></a> を削除したい場合はコメントアウトを外す
 */
function preprocessMarkdown(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const seen = new Set<string>();
  const preferUnique = new Set([
    "要約",
    "重要なキーワード・ポイント",
    "重要なキーワードやポイント",
    "関連キーワード",
  ]);

  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 空アンカーを消す場合はこちらを有効化
    // if (/^<a\s+id="[^"]+"\s*><\/a>\s*$/.test(line)) continue;

    const m = line.match(/^(#{1,6})\s+(.*)$/);
    if (!m) { out.push(line); continue; }

    const level = m[1].length;
    const text = m[2].trim();

    if (level <= 3) {
      const key = `${level}::${text}`;
      // 定型見出しは一度だけ残す
      if (preferUnique.has(text)) {
        if (seen.has(text)) continue; // 同じ文言を再出現させない
        seen.add(text);
      } else {
        if (seen.has(key)) continue; // 同レベル・同テキストを再出現させない
        seen.add(key);
      }
    }

    out.push(line);
  }

  return out.join("\n");
}

function formatYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ========= ダミーデータ =========
const analysisData = {
  dailySummaryCount: { values: [5, 7, 3, 8, 6, 9, 4] },
  averageUrlScore: { value: "75.2", change: "+3.5" },
  topCategories: [
    { rank: 1, name: "テクノロジー" },
    { rank: 2, name: "ビジネス" },
    { rank: 3, name: "エンターテイメント" },
  ],
};

// ========= チャート =========
const DummyChart: React.FC<{ data: ChartData }> = ({ data }) => {
  const maxValue = Math.max(...data.values, 1);
  return (
    <div className="grid grid-cols-7 gap-3 h-52">
      {data.values.map((value, index) => (
        <div key={index} className="flex flex-col justify-end items-center">
          <div
            className="w-full bg-violet-500 rounded-t-md"
            style={{ height: `${(value / maxValue) * 100}%` }}
            aria-label={`Day ${index + 1} value ${value}`}
            role="img"
          />
          <span className="text-sm text-gray-400 mt-2">{data.labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

// ========= 本体 =========
export default function Analyze(): JSX.Element {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [llmFeedback, setLlmFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0); // リトライ用
  const abortRef = useRef<AbortController | null>(null);

  // 過去7日間のラベル（例: "9/5"）
  const last7Days = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
    });
  }, []);

  const modifiedAnalysisData: { dailySummaryCount: ChartData } = useMemo(() => ({
    dailySummaryCount: { labels: last7Days, values: analysisData.dailySummaryCount.values },
  }), [last7Days]);

  // API呼び出し
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setLlmFeedback(null);

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const requestPath = `/analysis/${yesterday.getFullYear()}/${yesterday.getMonth() + 1}/${yesterday.getDate()}`;
        const data = await apiGet<AnalysisApiResponse>(requestPath, { signal: controller.signal } as any);

        const cleaned = preprocessMarkdown(data.markdown ?? "");
        setLlmFeedback(cleaned);
      } catch (err: any) {
        if (controller.signal.aborted) return; // キャンセル時は何もしない

        if (err instanceof Error) {
          const msg = err.message || "";
          // 認証
          if (msg.includes("401")) { navigate("/login"); return; }
          // データなし
          if (msg.includes("404")) { setError("データ不足"); }
          else { setError(msg); }
        } else {
          setError("予期せぬエラーが発生しました。");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => { controller.abort(); };
  }, [navigate, setLoading, retryKey]);

  return (
    <div className="min-h-screen bg-custom-purple text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10 space-y-6">
        {/* タイトル */}
        <div className="mb-4 md:mb-6 flex flex-col items-center gap-4">
          <h1 className="font-[var(--font-shippori)] bg-white text-custom-purple text-2xl md:text-3xl px-4 md:px-6 py-2 tracking-[0.4em] md:tracking-[0.6em] rounded-lg">
            分析結果
          </h1>
        </div>

        {/* 主要指標 */}
        <section aria-labelledby="metrics" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h2 id="metrics" className="sr-only">主要指標</h2>

          {/* URL評価の平均値 */}
          <article className="bg-gray-800/50 p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-400">学習難易度</p>
            <p className="text-2xl font-bold">{analysisData.averageUrlScore.value}</p>
            <p className={`text-sm ${analysisData.averageUrlScore.change.startsWith("+") ? "text-lime-400" : "text-red-400"}`}>
              前日比: {analysisData.averageUrlScore.change}
            </p>
          </article>

          {/* 注目のカテゴリ */}
          <article className="bg-gray-800/50 p-4 rounded-lg col-span-1 md:col-span-2 shadow">
            <p className="text-sm text-gray-400 mb-4 text-center">蓄積された知識ランキング</p>
            <ol className="space-y-3" aria-label="知識ランキング">
              {analysisData.topCategories.map((category) => (
                <li key={category.rank} className="flex items-baseline">
                  <p className="text-lg font-bold text-violet-300 w-16 text-center">{category.rank}位</p>
                  <p className="text-xl">{category.name}</p>
                </li>
              ))}
            </ol>
          </article>
        </section>

        {/* 要約件数グラフ */}
        <section aria-labelledby="summary-count" className="bg-gray-800/50 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400 text-center mb-4">学習した件数</p>
          <DummyChart data={modifiedAnalysisData.dailySummaryCount} />
        </section>

        {/* LLMからのフィードバック */}
        <section aria-labelledby="llm-feedback" className="bg-white text-gray-900 p-5 md:p-6 rounded-xl shadow-lg">
          <h2 id="llm-feedback" className="sr-only">LLMフィードバック</h2>

          {llmFeedback && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw as any, rehypeSlug as any, [rehypeSanitize as any, sanitizeSchema as any]]}
              className="prose prose-neutral prose-lg max-w-none"
            >
              {llmFeedback}
            </ReactMarkdown>
          )}

          {!llmFeedback && !error && (
            <p className="text-center text-gray-500">LLMフィードバックを読み込み中...</p>
          )}

          {error && (
            <div className="text-center space-y-3">
              <p className="text-gray-900 font-medium">{error}</p>
              <button
                type="button"
                onClick={() => setRetryKey((k) => k + 1)}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow"
              >
                リトライ
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
