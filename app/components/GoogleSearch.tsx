import type { FC } from "react";

type Props = {
	onTodaySearch: () => void;
}

export const GoogleSearch = () => {
	return(
		<div className="max-w-4xl mx-auto px-4">
			<h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block">
				Google検索
			</h2>
			<ul className="text-white my-3">
				<li>8/5 ウサギについて</li>
				<li>8/5 モモンガについてについて</li>
			</ul>
			{/* <ur>
			{logs?.map((log) => {
				return (
						<li key={log.id}>
							{log.content}
						</li>
				);
			})}
			</ur> */}
		</div>
	)
}