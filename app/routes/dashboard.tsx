import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import Header from "~/components/Header";
import { GoogleSearch } from "~/components/GoogleSearch";
import { ScanData } from "~/components/ScanData";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileResponse[]>([]);

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  // 初期ロード：ユーザー情報取得＋アップロード済み画像取得
  useEffect(() => {
    async function fetchUser() {
      try{
        const data = await apiGet<{ email: string}>("/profile");
        setUserEmail(data.email);
       
        const files = await apiGet<FileSummary>("/files");
        
        const fetchedFiles = await Promise.all(
          files.file_ids.map(id => apiGet<FileResponse>(`/file/${id}`))
        );
        setUploadedFiles(fetchedFiles);

        setLoading(false);
      }catch (err){
        // 401 など認証エラーならログインページへ
        console.error("Dashboard初期化に失敗:", err);
        navigate("/login");
      }
    }

    fetchUser();
  }, [navigate, uploadedFiles]);

  if (loading) return <p className="text-center mt-10">読み込み中...</p>;
  console.log(uploadedFiles);
  return (
    <div className="min-h-screen bg-custom-purple">
      <Header />
      <div>
        <div className="text-center">
          <Link to={`/summary?date=${dateStr}`}>
            <h1 className="font-[var(--font-shippori)] bg-white inline-block text-custom-purple text-3xl my-20 px-6 py-2 tracking-[0.6em] rounded-lg">
              本日の要約を見る
            </h1>
          </Link>
        </div>
        <div className="max-w-4xl mx-auto px-4">

          {/* カードの外で右端に配置 */}
          <div className="flex justify-end mt-3">
            <button
              className="font-[var(--font-shippori)] px-5 py-1 text-white transition border border-white text-lg"
            >
              再生成
            </button>
          </div>
        </div>
        <hr className="border-t-2 border-white my-4" />
        <GoogleSearch />
        <hr className="border-t-2 border-white my-4" />
        <ScanData files={uploadedFiles} />
      </div>
    </div>
  );
}
