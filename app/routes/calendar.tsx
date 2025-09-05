import { useEffect, useState } from "react";
import { apiGet } from "~/api/auth";
import { GoogleSearch } from "~/components/GoogleSearch";
import Header from "~/components/Header";
import { ScanData } from "~/components/ScanData";
import { Link } from "react-router";

interface FileSummary {
  date: string;
  file_ids: number[];
}

interface FileResponse {
  file_id: number;
  filename: string;
  content_base64: string;
  content_type: string;
  created_at: string;
}

interface HistoryItem {
  id: number;
  url: string;
  title: string;
  description: string;
  created_at: string;
}

interface HistoryResponse {
  date: string;
  histories: HistoryItem[];
}

interface FetchedLog {
  created_at: string;
  title: string;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [postedDays, setPostedDays] = useState<number[]>([]);
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [logs, setLogs] = useState<FetchedLog[]>([]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 月の日数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // 選択日付の文字列を作る（YYYY-MM-DD）
  const dateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  // postedDays の取得
  useEffect(() => {
    const fetchPostedDays = async () => {
      const yyyy = currentMonth.getFullYear();
      const mm = String(currentMonth.getMonth() + 1).padStart(2, "0");

      try {
        const res = await apiGet(`/profile?month=${yyyy}-${mm}`);
        const activeDates = res.active_dates;
        setPostedDays(activeDates);

      } catch (err) {
        console.log(err);
        setPostedDays([]);
      }
    };

    fetchPostedDays();
  }, [currentMonth]);

  // ファイル取得
  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      try {
        const fileRes = await apiGet<FileSummary>(`/files?date=${dateStr}`);

        const fetchedFiles = await Promise.all(
          fileRes.file_ids.map(id => apiGet<FileResponse>(`/file/${id}`))
        );
        setFiles(fetchedFiles);
        
        const historyRes = await apiGet<HistoryResponse>(`/history/${dateStr}`);
        const fetchedLogs = historyRes.histories.map(h => ({
          created_at: h.created_at,
          title: h.title,
        }));
        setLogs(fetchedLogs);
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [selectedDate, dateStr]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-custom-purple">
        {/* カレンダータイトル */}
        <h2 className="text-white text-3xl text-center tracking-[0.4em] p-2">履歴</h2>
        <hr className="border-t-2 border-white" />

        {/* 月切替 */}
        <div className="flex justify-center items-center gap-4 my-4 text-white">
          <button onClick={prevMonth} className="hover:scale-110 transition cursor-pointer">◀</button>
          <span className="text-2xl">{month + 1} 月</span>
          <button onClick={nextMonth} className="hover:scale-110 transition cursor-pointer">▶</button>
        </div>

        {/* カレンダー */}
        <div className="grid grid-cols-[repeat(7,auto)] gap-4 justify-center">
          {daysArray.map(day => {
            const isActive = postedDays.includes(day);
            return (
              <div key={day} className="relative">
                <div className="w-10 h-10 flex items-center justify-center bg-white text-custom-purple">
                  {day}
                </div>

                {isActive && (
                  <div
                    className="absolute inset-0 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                  >
                    <div className="w-6 h-6 bg-custom-purple text-white rounded-full flex items-center justify-center">
                      {day}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 選択日付のファイル表示 */}
        {selectedDate && files.length > 0 && (
          <>
            <hr className="border-t-2 border-white mt-15" />
            <div className="text-center pb-2">
              <p className="text-white text-xl">
                {selectedDate.getMonth() + 1}/{selectedDate.getDate()}
              </p>
              <Link to={`/summary?date=${dateStr}`}>
                <h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple bg-white inline-block">
                  要約カードを表示
                </h2>
              </Link>
            </div>
            <hr className="border-t-2 border-white mb-4" />
            <GoogleSearch logs={logs}/>
            <hr className="border-t-2 border-white mb-4" />
            <ScanData files={files} />
            <div className="h-20" />
          </>
        )}
      </div>
    </>
  );
}
