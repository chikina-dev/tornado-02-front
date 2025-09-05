import { useLoading } from "~/contexts/LoadingContext";

export default function LoadingOverlay() {
	const { loading } = useLoading();

	if (!loading) return null;

	return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader border-4 border-t-4 border-white rounded-full w-12 h-12 animate-spin"></div>
      <p className="text-white ml-4">ロード中...</p>
    </div>		
	);
}