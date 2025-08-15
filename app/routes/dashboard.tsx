import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet, apiPost } from "../api/auth";

interface UploadedFile {
  url: string;
  filename: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 初期ロード：ユーザー情報取得＋アップロード済み画像取得
  useEffect(() => {
    async function fetchUser() {
      const res = await apiGet("/profile");
      if (!res.ok) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      setUserEmail(data.email);
      await fetchUploadedFiles();
      setLoading(false);
    }

    async function fetchUploadedFiles() {
      const res = await apiGet("/uploaded-files");
      if (res.ok) {
        const data: UploadedFile[] = await res.json();
        setUploadedFiles(data);
      }
    }

    fetchUser();
  }, [navigate]);

  // ログアウト
  async function handleLogout() {
    await apiPost("/logout", {});
    navigate("/login");
  }

  // ファイル選択
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  }

  // アップロードボタン
  async function handleUpload() {
    if (!selectedFile) {
      alert("ファイルを選択してください");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const res = await fetch("http://localhost:8000/upload-avatar", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.ok) {
      const data: UploadedFile = await res.json();
      setUploadedFiles(prev => [...prev, data]);
      setSelectedFile(null);
      alert("アップロード成功！");
    } else {
      alert("アップロード失敗");
    }
  }

  // if (loading) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold mb-4">ダッシュボード</h1>
      {userEmail && <p className="mb-4 text-gray-700">こんにちは、{userEmail} さん</p>}

      {/* ファイル選択＋アップロードボタン */}
      <div className="mb-6">
        <label htmlFor="avatar" className="block text-gray-600 font-medium mb-2">
          プロフィール画像を選択
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 mb-2
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          アップロード
        </button>
      </div>

      {/* アップロード済み画像の一覧 */}
      {uploadedFiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">アップロード済み画像</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="border rounded p-1">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        ログアウト
      </button>
    </div>
  );
}
