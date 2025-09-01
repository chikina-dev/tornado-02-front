import Header from "~/components/Header";

// ダミーデータ（後でAPIから取得する）
const analysisData = {
  keyMetrics: [
    { label: "コンバージョン率", value: "3.5%", change: "+0.2%" },
    { label: "平均セッション時間", value: "2分15秒", change: "-5秒" },
    { label: "直帰率", value: "45%", change: "-2%" },
  ],
  chartData: {
    labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
    values: [120, 150, 180, 160, 200, 220],
  },
  analysisText: `
## 6月の分析サマリー

### **全体的なパフォーマンス**

今月は主要なKPIにおいて良好な結果が見られました。特に、コンバージョン率が前月比で0.2ポイント上昇し、目標としていた3%を達成しました。これは、先月実施したランディングページの改善が効果を発揮し始めたことを示唆しています。

### **トラフィックソース**

オーガニック検索からの流入が全体の60%を占め、引き続き最も重要なチャネルとなっています。一方で、SNS広告からの流入は微減しており、クリエイティブの再検討やターゲティングの見直しが必要です。

### **今後のアクション**

- **継続:** ランディングページのA/Bテストを継続し、さらなるCVR向上を目指す。
- **改善:** SNS広告のクリエイティブを刷新し、エンゲージメント率の改善を図る。
- **新規:** 新しいキーワードでのコンテンツマーケティングを計画し、オーガニック流入の拡大を狙う。
  `,
};

// 簡単なチャートを表示するダミーコンポーネント
const DummyChart = ({ data }: { data: { labels: string[]; values: number[] } }) => {
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
          <div key={index} className="flex-1 bg-custom-purple rounded-t-md" style={{ height: `${(value / maxValue) * 100}%` }}></div>
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
          {analysisData.keyMetrics.map((metric) => (
            <div key={metric.label} className="bg-gray-800/50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-400">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{metric.change}</p>
            </div>
          ))}
        </div>

        {/* チャート */}
        <div className="mb-8">
          <DummyChart data={analysisData.chartData} />
        </div>

        {/* 分析文章 */}
        <div className="bg-white text-gray-900 p-5 md:p-6 rounded-xl shadow-lg">
          <div
            className="prose prose-neutral prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: analysisData.analysisText.replace(/\n/g, '<br />') }}
          />
        </div>
      </div>
    </div>
  );
}