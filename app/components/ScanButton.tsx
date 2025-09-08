import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { apiUpload } from "~/api/auth";
import { useLoading } from "~/contexts/LoadingContext";
import { Upload } from "lucide-react";

interface UploadedFile {
  url: string;
  filename: string;
}

type ScanButtonProps = {
  onUploadSuccess?: () => void;
}

export const ScanButton: FC<ScanButtonProps> = ({ onUploadSuccess }) => {
  const [open, setOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { setLoading } = useLoading();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  async function uploadFile(file: File) {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const result = await apiUpload<UploadedFile>("/upload/file", formData);
      console.log("アップロード成功:", result);
      if (onUploadSuccess) onUploadSuccess();
      return result;
    } catch (error) {
      console.error("アップロード失敗", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(action: string) {
    setOpen(false);

    switch(action) {
      case "camera":
        cameraInputRef.current?.click();
        break;
      case "file":
        fileInputRef.current?.click();
        break;
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleButtonClick() {
    if (isMobile) {
      setOpen(!open); // スマホならメニューを表示
    } else {
      handleSelect("file"); // PCなら直接ファイル選択
    }
  }

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="py-1"
      >
        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white flex items-center justify-center shadow-md">
          <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-custom-purple" />
        </div>
      </button>

      {/* メニュー (スマホ専用) */}
      {isMobile && (
        <div
          ref={menuRef}
          className={`absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10
            transition-all duration-300 ease-out
            transform
            ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
          `}
        >
          <ul className="text-gray-700">
            <li className="border-b border-b-gray-300">
              <button
                onClick={() => handleSelect("camera")}
                className="w-full text-left px-4 py-1.5 hover:bg-gray-100 border-b-gray rounded-md"
              >
                写真を撮る
              </button>
            </li>
            <li className="border-b-gray-300">
              <button
                onClick={() => handleSelect("file")}
                className="w-full text-left px-4 py-1.5 hover:bg-gray-100 rounded-md"
              >
                写真を選択する
              </button>
            </li>
          </ul>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};
