import Header from "~/components/Header";

// ダミーデータ（後でAPIから取得する）
const analysisData = {
  llmFeedback: `
## LLMからのフィードバック

今週は特に「テクノロジー」関連のニュースを多く要約されていますね。素晴らしいです！専門用語が多い中、要点を的確に捉えられています。

来週は「経済」や「国際情勢」など、少し違う分野のニュースにも挑戦してみませんか？新しい発見があるかもしれません。
  `,
  dailySummaryCount: {
    labels: ["月", "火", "水", "木", "金", "土", "日"],
    values: [5, 7, 3, 8, 6, 9, 4],
  },
  averageUrlScore: {
    value: "75.2",
    change: "+3.5",
  },
  topCategories: [
    { rank: 1, name: "テクノロジー" },
    { rank: 2, name: "ビジネス" },
    { rank: 3, name: "エンターテイメント" },
  ],
};

// 簡単なチャートを表示するダミーコンポーネント
const DummyChart = ({
  data,
}: {
  data: { labels: string[]; values: number[] };
}) => {
  const maxValue = Math.max(...data.values);
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        {data.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="flex items-end h-40 space-x-2">
        {data.values.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-custom-purple rounded-t-md"
            style={{ height: `${(value / maxValue) * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default function Analyze() {
  return (
    <div className="min-h-screen bg-custom-purple text-white">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 md:mb-10 flex flex-col items-center gap-4">
          <h1 className="font-[var(--font-shippori)] bg-white text-custom-purple text-2xl md:text-3xl px-4 md:px-6 py-2 tracking-[0.4em] md:tracking-[0.6em] rounded-lg">
            分析結果
          </h1>
        </div>

        {/* 主要指標 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* URL評価の平均値 */}
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400">URL評価の平均値</p>
            <p className="text-2xl font-bold">
              {analysisData.averageUrlScore.value}
            </p>
            <p
              className={`text-sm ${analysisData.averageUrlScore.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
            >
              前日比: {analysisData.averageUrlScore.change}
            </p>
          </div>

          {/* 注目のカテゴリ */}
          <div className="bg-gray-800/50 p-4 rounded-lg text-center col-span-1 md:col-span-2">
            <p className="text-sm text-gray-400 mb-3">注目のカテゴリ Top 3</p>
            <div className="flex justify-around items-center h-full">
              {analysisData.topCategories.map((category) => (
                <div key={category.rank}>
                  <p className="text-lg font-bold text-yellow-400">
                    {category.rank}位
                  </p>
                  <p className="text-xl">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 要約件数グラフ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">
            指定日の要約件数
          </h2>
          <DummyChart data={analysisData.dailySummaryCount} />
        </div>

        {/* LLMからのフィードバック */}
        <div className="bg-white text-gray-900 p-5 md:p-6 rounded-xl shadow-lg">
          <div
            className="prose prose-neutral prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: analysisData.llmFeedback.replace(/\n/g, "<br />"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
