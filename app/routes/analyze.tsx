import Header from "~/components/Header";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { useLoading } from "~/contexts/LoadingContext";

// ========= 型 =========
interface AnalysisApiResponse {
  feedback: string;
  top_categories: string[];
  url_count: number;
  avg_difficulty: Record<string, number>;
}

interface ChartData {
  labels: string[];
  values: number[];
}

interface AnalysisData {
  llmFeedback: string | null;
  currentAnalysisResult: AnalysisApiResponse | null;
  yesterdayAnalysisResult: AnalysisApiResponse | null;
  chartData: ChartData | null;
  sevenDayAverageDifficulty: { value: number; change: number } | null;
  sevenDayTopCategories: string[] | null;
}

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
    const m = line.match(/^(#{1,6})\s+(.*)$/);
    if (!m) {
      out.push(line);
      continue;
    }
    const level = m[1].length;
    const text = m[2].trim();
    if (level <= 3) {
      const key = `${level}::${text}`;
      if (preferUnique.has(text)) {
        if (seen.has(text)) continue;
        seen.add(text);
      } else {
        if (seen.has(key)) continue;
        seen.add(key);
      }
    }
    out.push(line);
  }
  return out.join("\n");
}

const calculateAverageDifficulty = (avgDifficulty: Record<string, number>): number => {
  const difficulties = Object.values(avgDifficulty);
  if (difficulties.length === 0) {
    return 0;
  }
  return difficulties.reduce((a, b) => a + b, 0) / difficulties.length;
};

// ========= チャート =========
const DataChart: React.FC<{ data: ChartData }> = ({ data }) => {
  const maxValue = Math.max(...data.values, 1);
  return (
    <div className="grid grid-cols-7 gap-3 h-52">
      {data.values.map((value, index) => (
        <div key={index} className="flex flex-col justify-end items-center">
          {value > 0 && (
            <span className="text-xs text-white mb-1">{value}</span>
          )}
          <div
            className="w-full bg-violet-500 rounded-t-md transition-all duration-500"
            style={{ height: `${(value / maxValue) * 100}%` }}
            aria-label={`Day ${index + 1} value ${value}`}
            role="img"
          />
          <span className="text-sm text-gray-400 mt-2">
            {data.labels[index]}
          </span>
        </div>
      ))}
    </div>
  );
};

// ========= 本体 =========
export default function Analyze(): React.JSX.Element {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // API呼び出し
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setAnalysisData(null);

        // 14日分のAPIリクエストを作成
        const requests = [...Array(14)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (13 - i)); // 13日前から今日まで
          const requestPath = `/analysis/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
          return apiGet<AnalysisApiResponse>(requestPath);
        });

        const results = await Promise.allSettled(requests);

        const currentPeriodResults = results.slice(7); // 最新の7日間
        const previousPeriodResults = results.slice(0, 7); // その前の7日間

        let currentAnalysisResult: AnalysisApiResponse | null = null;
        let yesterdayAnalysisResult: AnalysisApiResponse | null = null;
        let llmFeedback: string | null = null;
        let chartData: ChartData | null = null;
        let sevenDayAverageDifficulty: { value: number; change: number } | null = null;
        let sevenDayTopCategories: string[] | null = null;

        // 主要指標とLLMフィードバックは最新の7日間のデータから取得
        const lastResult = currentPeriodResults[currentPeriodResults.length - 1];
        if (lastResult.status === 'fulfilled' && lastResult.value) {
          currentAnalysisResult = lastResult.value;
          llmFeedback = preprocessMarkdown(currentAnalysisResult.feedback ?? "");
        } else {
          const latestError = lastResult.reason?.message || "";
          if (latestError.includes("404")) {
            setError("最新の分析データがありません。");
          } else {
            setError("データ取得中にエラーが発生しました。");
          }
        }

        // 前日の分析結果を取得
        const yesterdayResult = currentPeriodResults[currentPeriodResults.length - 2]; // 最新の7日間のうち、最後から2番目
        if (yesterdayResult && yesterdayResult.status === 'fulfilled' && yesterdayResult.value) {
          yesterdayAnalysisResult = yesterdayResult.value;
        }

        // グラフデータの作成 (最新の7日間)
        const labels = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
        });
        const chartValues = currentPeriodResults.map(res => {
          if (res.status === 'fulfilled' && res.value) {
            return res.value.url_count;
          }
          return 0; // 失敗した日は0件とする
        });
        chartData = { labels, values: chartValues };

        // 7日間の平均難易度と前日比の計算
        const currentDifficulties = currentPeriodResults
          .filter(res => res.status === 'fulfilled' && res.value)
          .map(res => calculateAverageDifficulty(res.value!.avg_difficulty));
        
        const currentAverageDifficulty = currentDifficulties.length > 0
          ? currentDifficulties.reduce((a, b) => a + b, 0) / currentDifficulties.length
          : 0;

        const previousDifficulties = previousPeriodResults
          .filter(res => res.status === 'fulfilled' && res.value)
          .map(res => calculateAverageDifficulty(res.value!.avg_difficulty));

        const previousAverageDifficulty = previousDifficulties.length > 0
          ? previousDifficulties.reduce((a, b) => a + b, 0) / previousDifficulties.length
          : 0;

        const difficultyChange = currentAverageDifficulty - previousAverageDifficulty;
        sevenDayAverageDifficulty = { value: currentAverageDifficulty, change: difficultyChange };

        // 7日間の蓄積された知識ランキングの計算
        const allCategories: string[] = [];
        currentPeriodResults.forEach(res => {
          if (res.status === 'fulfilled' && res.value) {
            allCategories.push(...res.value.top_categories);
          }
        });

        const categoryCounts = new Map<string, number>();
        allCategories.forEach(category => {
          categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
        });

        sevenDayTopCategories = Array.from(categoryCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0]);

        setAnalysisData({
          llmFeedback,
          currentAnalysisResult,
          yesterdayAnalysisResult,
          chartData,
          sevenDayAverageDifficulty,
          sevenDayTopCategories,
        });

      } catch (err: any) {
        if (controller.signal.aborted) return;
        if (err instanceof Error && err.message.includes("401")) {
          navigate("/login");
          return;
        }
        setError("予期せぬエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [navigate, setLoading, retryKey]);

  return (
    <div className="min-h-screen bg-custom-purple text-white">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10 space-y-6">
        {/* ... (タイトル部分は変更なし) ... */}
        <div className="mb-4 md:mb-6 flex flex-col items-center gap-4">
          <h1 className="font-[var(--font-shippori)] bg-white text-custom-purple text-2xl md:text-3xl px-4 md:px-6 py-2 tracking-[0.4em] md:tracking-[0.6em] rounded-lg">
            分析結果
          </h1>
        </div>

        {/* 主要指標 */}
        <section
          aria-labelledby="metrics"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <h2 id="metrics" className="sr-only">主要指標</h2>

          {/* URL評価の平均値 */}
          <article className="bg-gray-800/50 p-4 rounded-lg text-center shadow">
            <p className="text-sm text-gray-400">学習難易度</p>
            {analysisData?.currentAnalysisResult ? (
              <>
                <p className="text-2xl font-bold">
                  {calculateAverageDifficulty(analysisData.currentAnalysisResult.avg_difficulty).toFixed(1)}
                </p>
                {analysisData.yesterdayAnalysisResult && (
                  <p
                    className={`text-sm ${ 
                      calculateAverageDifficulty(analysisData.currentAnalysisResult.avg_difficulty) -
                        calculateAverageDifficulty(analysisData.yesterdayAnalysisResult.avg_difficulty) >= 
                      0
                        ? "text-lime-400"
                        : "text-red-400"
                    }`}
                  >
                    前日比: {
                      (calculateAverageDifficulty(analysisData.currentAnalysisResult.avg_difficulty) -
                      calculateAverageDifficulty(analysisData.yesterdayAnalysisResult.avg_difficulty)).toFixed(1)
                    }
                  </p>
                )}
              </>
            ) : (
              <p className="text-2xl font-bold">-</p>
            )}
          </article>

          {/* 注目のカテゴリ */}
          <article className="bg-gray-800/50 p-4 rounded-lg col-span-1 md:col-span-2 shadow">
            <p className="text-sm text-gray-400 mb-4 text-center">蓄積された知識ランキング</p>
            {analysisData?.sevenDayTopCategories && analysisData.sevenDayTopCategories.length > 0 ? (
              <ol className="space-y-3" aria-label="知識ランキング">
                {analysisData.sevenDayTopCategories.map((category, index) => (
                  <li key={index} className="flex items-baseline">
                    <p className="text-lg font-bold text-violet-300 w-16 text-center">{index + 1}位</p>
                    <p className="text-xl">{category}</p>
                  </li>
                ))}
              </ol>
            ) : <p className="text-center text-gray-400">データがありません</p>}
          </article>
        </section>

        {/* 要約件数グラフ */}
        <section
          aria-labelledby="summary-count"
          className="bg-gray-800/50 p-4 rounded-lg shadow"
        >
          <p className="text-sm text-gray-400 text-center mb-4">学習した件数 (過去7日間)</p>
          {analysisData?.chartData ? <DataChart data={analysisData.chartData} /> : <div className="h-52 flex justify-center items-center"><p>グラフデータを読み込み中...</p></div>}
        </section>

        {/* LLMからのフィードバック */}
        <section
          aria-labelledby="llm-feedback"
          className="bg-white text-gray-900 p-5 md:p-6 rounded-xl shadow-lg"
        >
          <h2 id="llm-feedback" className="sr-only">LLMフィードバック</h2>
          {analysisData?.llmFeedback && (
            <div className="prose prose-neutral prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw as any,
                  rehypeSlug as any,
                  [rehypeSanitize as any, sanitizeSchema as any],
                ]}
              >
                {analysisData.llmFeedback}
              </ReactMarkdown>
            </div>
          )}
          {!analysisData?.llmFeedback && !error && (
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