import { useEffect, type FC } from "react";
import { Link } from "react-router";
import { apiGet, apiPost } from "../api/auth";
import { useNavigate } from "react-router";

type Props = {
	open: boolean;
	id: string;
}
export const Navigation: FC<Props> = ({ open, id }) => {
	const navigate = useNavigate();

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
		try {
			await apiPost("/logout", {}, undefined, true);
		} catch(err) {
			console.log("ログアウトAPI失敗", err);
		} finally {
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");

			navigate("/login");
		}
	}

	return(
		<nav
			id={id}
			aria-hidden={!open}
			className={`z-50 fixed top-17 left-0 w-full h-full bg-custom-purple shadow-md flex flex-col items-center transition-all duration-300 ${
				open ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<ul className="w-full text-center text-3xl tracking-[0.6em] mt-20">
				<li className="py-7 text-white"><Link to="/dashboard">ホーム</Link></li>
				<li className="py-7 text-white"><Link to="/analyze">分析結果</Link></li>
				<li className="py-7 text-white"><Link to="/calendar">履歴</Link></li>
				<li className="py-7 text-white"><Link to="/inquiry">お問い合わせ</Link></li>
				<li className="py-7 text-white">使い方</li>
				<li className="py-7 text-white"><button onClick={handleLogout}>ログアウト</button></li>
			</ul>
		</nav>	
	);
};