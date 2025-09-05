import type { FC } from "react";

interface FileResponse {
  file_id: string;
  filename: string;
  content_type: string;
  content_base64: string;
}

interface ScanDataProps {
  files: FileResponse[];
}

export const ScanData: FC<ScanDataProps> = ({ files }) => {
  if (!files.length) return <p>データがありません</p>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block">
        スキャンデータ
      </h2>

      {/* 横スクロール領域 */}
      <div
        className="mt-5"
        style={{
          overflowX: "auto",
          msOverflowStyle: "none", // IE, Edge
          scrollbarWidth: "none",   // Firefox
        }}
      >
        <div className="flex gap-4">
          {files.map((file) => {
            const src = `data:${file.content_type};base64,${file.content_base64}`;
            return (
              <div
                key={file.file_id}
                className="bg-black p-2 rounded-lg flex-shrink-0 w-64"
              >
                <img
                  src={src}
                  alt={file.filename}
                  className="w-full h-auto rounded"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
