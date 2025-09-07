import { useState, type FC } from "react";

type Log = {
	created_at: string;
	title: string;
};

type Props = {
	logs: Log[];
};

export const GoogleSearch: FC<Props> = ({ logs }) => {
	const cleanedLogs = logs
		.filter(log => log.title && log.title !== "Error")
		.filter((log, index, self) =>
			index === self.findIndex(l => l.title === log.title)
		);

	const [showAll, setShowAll] = useState(false);
	const MAX_VISIBLE = 5;

	function formatMonthDay(iso: string) {
		const d = new Date(iso);
		return `${d.getMonth() + 1}/${d.getDate()}`;
	}

	const visibleLogs = showAll ? cleanedLogs : cleanedLogs.slice(0, MAX_VISIBLE);

	return (
		<div className="max-w-4xl mx-auto px-4">
			<h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block rounded-lg">
				Google検索
			</h2>
			{cleanedLogs.length > 0 ? (
				<>
					<ul className="text-white my-3">
						{visibleLogs.map((log) => (
							<li key={log.created_at}>
								{formatMonthDay(log.created_at)} {log.title}
							</li>
						))}
					</ul>
					{cleanedLogs.length > MAX_VISIBLE && (
						<button
							className="text-white underline mb-3 block text-left"
							onClick={() => setShowAll(prev => !prev)}
						>
							{showAll ? "閉じる" : "もっと見る"}
						</button>
					)}
				</>
			) : (
				<p className="text-white my-3">今日は検索ログがありません</p>
			)}
		</div>
	)
}