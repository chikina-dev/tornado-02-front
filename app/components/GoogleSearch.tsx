import type { FC } from "react";

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
	function formatMonthDay(iso: string) {
		const d = new Date(iso);
		return `${d.getMonth() + 1}/${d.getDate()}`;
	}

	return(
		<div className="max-w-4xl mx-auto px-4">
			<h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block">
				Google検索
			</h2>
			{cleanedLogs.length > 0 ? (
			<ul className="text-white my-3">
				{cleanedLogs.map((log) => (
					<li key={log.created_at}>
						{formatMonthDay(log.created_at)} {log.title}
					</li>
				))}
			</ul>
			) : (
				<p className="text-white my-3">今日は検索ログがありません</p>
			)}
		</div>
	)
}