import type { Route } from "./+types/_index";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import Header from "~/components/Header";
import { GoogleSearch } from "~/components/GoogleSearch";
import { ScanData } from "~/components/ScanData";
import { useLoading } from "~/contexts/LoadingContext";

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

const LAST_VIEWED_SUMMARY_KEY = "lastViewedSummaryDate";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Viofolio" },
    { name: "Viofolio", content: "学習アプリです。" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileResponse[]>([]);
  const [logs, setLogs] = useState<FetchedLog[]>([]);
  const [showNew, setShowNew] = useState(false);

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  // ✅ NEW 表示判定
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const lastViewed = localStorage.getItem(LAST_VIEWED_SUMMARY_KEY);

    if (!lastViewed || lastViewed !== yesterdayStr) {
      setShowNew(true);
    } else {
      setShowNew(false);
    }
  }, []);

  async function refreshUploadedFiles() {
    setLoading(true);
    try {
      const files = await apiGet<FileSummary>("/files");
      const fetchedFiles = await Promise.all(
        files.file_ids.map((id) => apiGet<FileResponse>(`/file/${id}`))
      );
      setUploadedFiles(fetchedFiles);
    } catch (err) {
      console.log("ファイル取得失敗", err);
    } finally {
      setLoading(false);
    }
  }

  // 初期ロード
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const data = await apiGet<{ email: string }>("/profile");
        setUserEmail(data.email);

        const historyRes = await apiGet<HistoryResponse>(`/history/${dateStr}`);
        const fetchedLogs = historyRes.histories.map((h) => ({
          created_at: h.created_at,
          title: h.title,
        }));
        setLogs(fetchedLogs);

        await refreshUploadedFiles();
      } catch (err) {
        console.error("Dashboard初期化に失敗:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  // ✅ Summaryボタンクリック処理
  const handleOpenSummary = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    localStorage.setItem(LAST_VIEWED_SUMMARY_KEY, yesterdayStr);

    navigate(`/summary?date=${yesterdayStr}`);
  };

  return (
  <div className="min-h-screen bg-custom-purple w-full overflow-x-hidden">
      <Header onUploadSuccess={refreshUploadedFiles} />
    <div> 
      <div className="text-center">
        <div className="relative my-20">
          <button
            onClick={handleOpenSummary}
            className="relative bg-white inline-block text-custom-purple text-2xl sm:text-3xl px-8 sm:px-12 py-2 sm:py-3 tracking-[0.3rem] sm:tracking-[0.6rem] rounded-lg"
          >
            新着の要約を見る
            {showNew && (
              <span 
                className="absolute flex items-center justify-center pl-0.5 text-sm sm:text-lg w-10 sm:w-15 h-10 sm:h-15 -top-4 sm:-top-8 -left-4 sm:-left-7 bg-[#C5B4E3] text-white rounded-full font-sans tracking-[0.05em] sm:tracking-[0.1em]"
              >
                NEW
              </span>
            )}
          </button>
        </div>
      </div>
        <hr className="border-t-2 border-white my-4" />
        <GoogleSearch logs={logs} />
        <hr className="border-t-2 border-white my-4" />
        <ScanData files={uploadedFiles} />
        <div className="h-20" />
    </div>
  </div>
  );
}
