import { useState } from "react";
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
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block rounded-lg">
        スキャンデータ
      </h2>
      {files.length ? (
        <>
          {/* 横スクロール領域 */}
          <div
            className="mt-5 bg-black/20 p-4 rounded-lg"
            style={{
              overflowX: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
<div className="flex gap-5 p-2">
  {files.map((file) => {
    const src = `data:${file.content_type};base64,${file.content_base64}`;
    return (
      <div
        key={file.file_id}
        className="bg-white rounded-lg flex-shrink-0 w-40 sm:w-64 h-40 sm:h-64 flex items-center justify-center cursor-pointer"
        onClick={() => setSelected(src)}
      >
        <img
          src={src}
          alt={file.filename}
          className="max-w-full max-h-full object-contain rounded"
        />
      </div>
    );
  })}
</div>

          </div>

          {/* モーダル */}
          {selected && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }} // 全体の背景も少し透ける
            >
              {/* ×ボタン */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white bg-black text-2xl bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center font-bold hover:bg-opacity-90"
              >
                ×
              </button>

              {/* 写真の周りの黒いボックスを半透明に */}
              <div className="p-4 bg-black bg-opacity-50 rounded-lg">
                <img
                  src={selected}
                  alt="preview"
                  className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-white my-3">データがありません</p>
      )}

    </div>
  );
};
