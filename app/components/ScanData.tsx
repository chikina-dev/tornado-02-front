import type { FC } from "react";
import { useEffect, useState } from "react";
import { apiGet } from "~/api/auth"; 

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

export const ScanData: FC = () => {
  const [files, setFiles] = useState<FileResponse[]>([]);
  const [loading, setLoading] = useState(true);

	async function fetchFiles() {
		setLoading(true);
		try {
			const summaries = await apiGet<FileSummary>("/files");
			const allFileIds = summaries.file_ids;

			const fetchedFiles = await Promise.all(
				allFileIds.map(id => apiGet<FileResponse>(`/file/${id}`))
			);

			setFiles(fetchedFiles);
		} catch (error) {
			console.error("ファイル一覧取得エラー:", error);
		} finally {
			setLoading(false);
		}
	}

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block">
        スキャンデータ
      </h2>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {files.map(file => {
          const src = `data:${file.content_type};base64,${file.content_base64}`;
          return (
            <div key={file.file_id} className="bg-black p-2">
              <img src={src} alt={file.filename} className="w-full h-auto" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
