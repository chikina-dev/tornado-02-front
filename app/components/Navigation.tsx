import { useEffect, type FC } from "react";
import { Link } from "react-router";
import { apiGet, apiPost } from "../api/auth";
import { useNavigate } from "react-router";
import { useLoading } from "~/contexts/LoadingContext";

type Props = {
	open: boolean;
	id: string;
}
export const Navigation: FC<Props> = ({ open, id }) => {
	const navigate = useNavigate();
	const { setLoading } = useLoading();

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// ログアウト
	async function handleLogout() {
		setLoading(true);
		try {
			await apiPost("/logout", {}, undefined, true);
		} catch(err) {
			console.log("ログアウトAPI失敗", err);
		} finally {
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			navigate("/login");
			setLoading(false);
		}
	}

	return(
		<nav
			id={id}
			aria-hidden={!open}
			className={`z-50 fixed top-21.5 left-0 w-full h-full bg-custom-purple shadow-md flex flex-col items-center transition-all duration-300 ${
				open ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<ul className="w-full text-center text-2xl tracking-[0.6em] mt-5">
				<li className="py-7 text-white"><Link to="/">ホーム</Link></li>
				<li className="py-7 text-white"><Link to="/analyze">分析結果</Link></li>
				<li className="py-7 text-white"><Link to="/calendar">履歴</Link></li>
				<li className="py-7 text-white"><Link to="/inquiry">お問い合わせ</Link></li>
				<li className="py-7 text-white"><Link to="/use">使い方</Link></li>
				<li className="py-7 text-white"><Link to="/privacy">プライバシーポリシー</Link></li>
				<li className="py-7 text-white"><button onClick={handleLogout}>ログアウト</button></li>
			</ul>
		</nav>	
	);
};