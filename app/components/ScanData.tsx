import type { FC } from "react";

type Props = {
	onTodaySearch: () => void;
}

export const ScanData = () => {
	return(
		<div className="max-w-4xl mx-auto px-4">
			<h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple text-xl text-left bg-white inline-block">
				スキャンデータ
			</h2>
			<div>
				<h1 className="bg-black p-20 inline-block mt-5 mr-2">

				</h1>
				<h1 className="bg-black p-20 inline-block mt-5 mr-2">

				</h1>
				<h1 className="bg-black p-20 inline-block mt-5 mr-2">

				</h1>

			</div>
			{/* <ur>
			{images?.map((image) => {5
				return (
						<li key={image.id}>
							{image.url}
						</li>
				);
			})}
			</ur> */}
		</div>
	)
}