import type { FC } from "react";

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
        <div className="grid grid-cols-3 gap-4 mt-5">
          {files.map(file => {
            const src = `data:${file.content_type};base64,${file.content_base64}`;
            return (
              <div key={file.file_id} className="bg-black p-2">
                <img src={src} alt={file.filename} />
              </div>
            );
          })}
        </div>
      </div>
  );
};
