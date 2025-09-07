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
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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

    navigate(`/summary?date=${dateStr}`);
  };

  return (
    <div className="min-h-screen bg-custom-purple">
      <Header onUploadSuccess={refreshUploadedFiles} />
      <div>
        <div className="text-center relative">
          <button
            onClick={handleOpenSummary}
            className="relative font-[var(--font-shippori)] bg-white inline-block text-custom-purple text-3xl my-20 px-6 py-2 tracking-[0.6em] rounded-lg"
          >
            Summary
            {showNew && (
              <span className="absolute -top-4 -right-6 bg-[#C5B4E3] text-white text-sm px-3 py-1 rounded-full">
                NEW
                </span>
              )}
          </button>
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
