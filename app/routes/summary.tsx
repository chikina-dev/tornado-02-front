import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import Header from "~/components/Header";

interface Summary {
  summary_text: string;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Summary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      setSummary(null);
      try {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const data = await apiGet<Summary>(`/summaries/${year}/${month}/${day}`);
        setSummary(data.summary_text);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("401")) {
            navigate("/login");
            return;
          }
          // 404の場合は要約がないとみなし、エラー表示はしない
          if (err.message.includes("404")) {
            console.log("No summary for this date.");
          } else {
            setError(err.message);
          }
        } else {
          setError("An unexpected error occurred.");
        }
        console.error("Failed to fetch summary:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [navigate, date]);

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newDate = new Date(event.target.value);
    // JSTの0時を指定
    newDate.setHours(newDate.getHours() + 9);
    setDate(newDate);
  }

  return (
    <div className="min-h-screen bg-custom-purple text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="font-[var(--font-shippori)] bg-white inline-block text-custom-purple text-3xl px-6 py-2 tracking-[0.6em] rounded-lg">
            本日の要約
          </h1>
          <div className="mt-4">
            <input 
              type="date" 
              value={formatDate(date)} 
              onChange={handleDateChange} 
              className="bg-gray-700 text-white p-2 rounded"
            />
          </div>
        </div>
        
        {loading && <p className="text-center">読み込み中...</p>}
        
        {error && <p className="text-center text-red-400">エラー: {error}</p>}

        {summary && (
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <p className="whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {!loading && !summary && !error && (
          <p className="text-center">この日の要約はありません。</p>
        )}
      </div>
    </div>
  );
}
