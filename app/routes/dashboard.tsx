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

export default function Dashboard() {
  const navigate = useNavigate();
  const {setLoading} = useLoading();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileResponse[]>([]);
  const [logs, setLogs] = useState<FetchedLog[]>([]);

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  // 初期ロード：ユーザー情報取得＋アップロード済み画像取得
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try{
        const data = await apiGet<{ email: string}>("/profile");
        setUserEmail(data.email);
       
        const files = await apiGet<FileSummary>("/files");
        
        const fetchedFiles = await Promise.all(
          files.file_ids.map(id => apiGet<FileResponse>(`/file/${id}`))
        );

        setUploadedFiles(fetchedFiles);

        const historyRes = await apiGet<HistoryResponse>(`/history/${dateStr}`);
        const fetchedLogs = historyRes.histories.map(h => ({
         created_at: h.created_at,
         title: h.title,
        }));
        setLogs(fetchedLogs);

      }catch (err){
        // 401 など認証エラーならログインページへ
        console.error("Dashboard初期化に失敗:", err);
        navigate("/login");
      } finally{
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-custom-purple">
      <Header />
      <div>
        <div className="text-center">
          <Link to={`/summary?date=${dateStr}`}>
            <h1 className="font-[var(--font-shippori)] bg-white inline-block text-custom-purple text-3xl my-20 px-6 py-2 tracking-[0.6em] rounded-lg">
              Summary
            </h1>
          </Link>
        </div>
        <div className="max-w-4xl mx-auto px-4">

          
        </div>
        <hr className="border-t-2 border-white my-4" />
        <GoogleSearch logs={logs}/>
        <hr className="border-t-2 border-white my-4" />
        <ScanData files={uploadedFiles} />
        <div className="h-20" />
      </div>
    </div>
  );
}
