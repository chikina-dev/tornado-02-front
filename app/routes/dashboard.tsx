import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "../api/auth";
import Header from "~/components/Header";

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
  //       await fetchUploadedFiles();
  //       setLoading(false);
  //     }catch{
  //       navigate("/login");
  //     }
  //   }

  //   async function fetchUploadedFiles() {
  //     try{
  //         const data = await apiGet<UploadedFile[]>("/uploaded/files");
  //         setUploadedFiles(data);
  //     }catch {
  //       console.error("ファイル一覧取得に失敗しました");
  //     }
  //   }
  //   fetchUser();
  // }, [navigate]);

  // if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="min-h-screen bg-custom-purple">
      <Header />
      <div className="px-4">
        <h1 className="font-[var(--font-shippori)] text-white text-4xl mt-10 text-center tracking-[0.4em]">
          本日の要約
        </h1>
        <div className="max-w-4xl mx-auto">
          {/* 白いカード */}
          <div className="p-6 bg-white shadow-md mt-3">
            <p className="text-gray-800 whitespace-pre-line break-words">
              summary
            </p>
          </div>

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
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block">
            Google検索
          </h2>
          <ul className="text-white my-3">
            <li>8/5 ウサギについて</li>
            <li>8/5 モモンガについてについて</li>
          </ul>
          {/* <ur>
          {logs?.map((log) => {
            return (
                <li key={log.id}>
                  {log.content}
                </li>
            );
          })}
          </ur> */}

        </div>
        <hr className="border-t-2 border-white my-4" />
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block">
            スキャンデータ
          </h2>
          <div>
            <h1 className="bg-black p-20 inline-block mt-5 mr-2">

            </h1>
            <h1 className="bg-black p-20 inline-block mt-5 mr-2">

            </h1>
            <h1 className="bg-black p-20 inline-block mt-5 mr-2">

            </h1>

          </div>
          {/* <ur>
          {images?.map((image) => {5
            return (
                <li key={image.id}>
                  {image.url}
                </li>
            );
          })}
          </ur> */}
        </div>
      </div>
    </div>
  );
}
