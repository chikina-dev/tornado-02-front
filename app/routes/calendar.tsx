import { useState } from "react";
import { GoogleSearch } from "~/components/GoogleSearch";
import Header from "~/components/Header";
import { ScanData } from "~/components/ScanData";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // 月の日数を取得
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () =>
    setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(new Date(year, month + 1, 1));

  return (
		<>
			<Header />
			<div className="min-h-screen bg-custom-purple">
				
				{/* カレンダータイトル */}
				<h2 className="text-white text-3xl text-center tracking-[0.4em] p-2">履歴</h2>
				<hr className="border-t-2 border-white" />

				{/* 月切替 */}
				<div className="flex justify-center items-center gap-4 my-4 text-white">
					<button onClick={prevMonth} className="hover:scale-110 transition">
						◀
					</button>
					<span className="text-2xl">{month + 1} 月</span>
					<button onClick={nextMonth} className="hover:scale-110 transition">
						▶
					</button>
				</div>

				<div className="grid grid-cols-[repeat(7,auto)] gap-4 justify-center">
					{daysArray.map((day) => {
						const isToday =
							day === new Date().getDate() &&
							month === new Date().getMonth() &&
							year === new Date().getFullYear();

						return (
							<div key={day} className="relative">
								{/* 白い背景ボタン */}
								<button
									onClick={() => setSelectedDate(new Date(year, month, day))}
									className="w-8 h-8 flex items-center justify-center bg-white text-custom-purple hover:bg-gray-200 transition"
								>
									{day}
								</button>

								{/* 今日だけ紫丸を中央に配置 */}
								{isToday && (
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-6 h-6 bg-custom-purple text-white rounded-full flex items-center justify-center">
											{day}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
				<hr className="border-t-2 border-white mt-15" />
					<div className="text-center pb-2">
						<p className="text-white text-xl">8/5</p>
          <h2 className="font-[var(--font-shippori)] px-2 py-0.5 text-custom-purple bg-white inline-block">
            要約カードを表示
          </h2>						
					</div>
				<hr className="border-t-2 border-white mb-4" />
					<GoogleSearch />
				<hr className="border-t-2 border-white mb-4" />
					<ScanData />
			</div>
		</>

  );
}
