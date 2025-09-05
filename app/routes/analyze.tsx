import Header from "~/components/Header";

// ダミーデータ（後でAPIから取得する）
const analysisData = {
  llmFeedback: `
## LLMからのフィードバック

今週は特に「テクノロジー」関連のニュースを多く要約されていますね。素晴らしいです！専門用語が多い中、要点を的確に捉えられています。

来週は「経済」や「国際情勢」など、少し違う分野のニュースにも挑戦してみませんか？新しい発見があるかもしれません。
  `,
  dailySummaryCount: {
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
}: { data: { labels: string[]; values: number[] }; }) => {
  const maxValue = Math.max(...data.values, 1);
  return (
    <div className="grid grid-cols-7 gap-3 h-52">
      {data.values.map((value, index) => (
        <div key={index} className="flex flex-col justify-end items-center">
          <div
            className="w-full bg-violet-500 rounded-t-md"
            style={{ height: `${(value / maxValue) * 100}%` }}
          ></div>
          <span className="text-sm text-gray-400 mt-2">{data.labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

export default function Analyze() {
  // 過去7日間の日付ラベルを生成 (例: "9/5")
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }).reverse();

  const modifiedAnalysisData = {
    ...analysisData,
    dailySummaryCount: {
      ...analysisData.dailySummaryCount,
      labels: last7Days,
    },
  };

  return (
    <div className="min-h-screen bg-custom-purple text-white">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <div className="mb-6 md:mb-10 flex flex-col items-center gap-4">
          <h1 className="font-[var(--font-shippori)] bg-white text-custom-purple text-2xl md:text-3xl px-4 md:px-6 py-2 tracking-[0.4em] md:tracking-[0.6em] rounded-lg">
            分析結果
          </h1>
        </div>

        {/* 主要指標 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* URL評価の平均値 */}
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400">学習難易度</p>
            <p className="text-2xl font-bold">
              {analysisData.averageUrlScore.value}
            </p>
            <p
              className={`text-sm ${analysisData.averageUrlScore.change.startsWith("+") ? "text-lime-400" : "text-red-400"}`}
            >
              前日比: {analysisData.averageUrlScore.change}
            </p>
          </div>

          {/* 注目のカテゴリ */}
          <div className="bg-gray-800/50 p-4 rounded-lg col-span-1 md:col-span-2">
            <p className="text-sm text-gray-400 mb-4 text-center">蓄積された知識ランキング</p>
            <div className="space-y-3">
              {analysisData.topCategories.map((category) => (
                <div key={category.rank} className="flex items-baseline">
                  <p className="text-lg font-bold text-violet-300 w-16 text-center">
                    {category.rank}位
                  </p>
                  <p className="text-xl">{category.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 要約件数グラフ */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400 text-center mb-4">
            学習した件数
          </p>
          <DummyChart data={modifiedAnalysisData.dailySummaryCount} />
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