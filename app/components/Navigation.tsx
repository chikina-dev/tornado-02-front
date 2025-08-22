import type { FC } from "react";
import { Link } from "react-router";
import { apiGet, apiPost } from "../api/auth";
import { useNavigate } from "react-router";

type Props = {
	open: boolean;
	id: string;
}
export const Navigation: FC<Props> = ({ open, id }) => {
	const navigate = useNavigate();

	// ログアウト
	async function handleLogout() {
		await apiPost("/logout", {});
		navigate("/login");
	}

	return(
		<nav
			id={id}
			aria-hidden={!open}
			className={`fixed top-17 left-0 w-full h-full bg-custom-purple shadow-md flex flex-col items-center justify-center transition-all duration-300 ${
				open ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<ul className="w-full text-center text-2xl tracking-[0.6em]">
				<li className="py-5 text-white"><Link to="/dashboard">ホーム</Link></li>
				<li className="py-5 text-white">履歴</li>
				<li className="py-5 text-white"><Link to="/login">ログイン</Link></li>
				<li className="py-5 text-white"><Link to="/inquiry">お問い合わせ</Link></li>
				<li className="py-5 text-white">使い方</li>
				<li className="py-5 text-white" ><button onClick={handleLogout}>ログアウト</button></li>
			</ul>
		</nav>	
	);
};