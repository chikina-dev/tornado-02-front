import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "~/api/auth";
import { useLoading } from "~/contexts/LoadingContext";

export function useAuthCheck() {
	const navigate = useNavigate();
	const { setLoading } = useLoading();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		async function checkAuth() {
			setLoading(true);
			try {
				await apiGet<{ email: string}>("/profile");
				setIsAuthenticated(true);
			} catch(err) {
				console.error("認証チェック失敗", err);
				setIsAuthenticated(false);
				navigate("/login");
			} finally {
				setLoading(false);
			}
		}
		checkAuth();
	},[navigate]);

	return isAuthenticated;
}