import { useEffect, useState } from "react";
import { useLoading } from "~/contexts/LoadingContext";

export default function LoadingOverlay() {
	const { loading } = useLoading();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

	if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-custom-purple bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        {/* ロゴの円アイコン部分 */}
        <img 
          src="/tornado-02-front/image/loading.png" 
          alt="モモンガローディング画像" 
          className="w-24 sm:w-36 animate-pulse"
        />
        {/* テキスト */}
        <p className="text-white text-lg tracking-widest animate-pulse">
          loading{dots}
        </p>
      </div>
    </div>
  );
}