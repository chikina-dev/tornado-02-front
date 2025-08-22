import type { FC } from "react";
import { useState } from "react";

interface UploadedFile {
  url: string;
  filename: string;
}

export const ScanButton: FC = () => {
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
	return (
		<button className="font-[var(--font-shippori)] px-8 py-1 text-custom-purple ml-auto bg-white inline-block">
			アップロード
		</button>
	)
}