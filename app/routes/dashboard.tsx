import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import Header from "~/components/Header";
import { GoogleSearch } from "~/components/GoogleSearch";
import { ScanData } from "~/components/ScanData";

interface UploadedFile {
  url: string;
  filename: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // 初期ロード：ユーザー情報取得＋アップロード済み画像取得
  // useEffect(() => {
  //   async function fetchUser() {
  //     try{
  //       const data = await apiGet<{ email: string}>("/profile");
  //       setUserEmail(data.email);
       
  //       const files = await apiGet<UploadedFile[]>("/uploaded/files");
  //       setUploadedFiles(files);

  //       setLoading(false);
  //     }catch (err){
  //       // 401 など認証エラーならログインページへ
  //       console.error("Dashboard初期化に失敗:", err);
  //       navigate("/login");
  //     }
  //   }

  //   fetchUser();
  // }, [navigate]);

  // if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="min-h-screen bg-custom-purple">
      <Header />
      <div>
        <div className="text-center">
          <h1 className="font-[var(--font-shippori)] bg-white inline-block text-custom-purple text-3xl my-20 px-6 py-2 tracking-[0.6em] rounded-lg">
            本日の要約を見る
          </h1>
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
        <ScanData />
      </div>
    </div>
  );
}
