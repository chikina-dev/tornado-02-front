import { Link } from "react-router";
import ErrorMessage from "~/components/ErrorMessage";
import Header from "~/components/Header";
import { Upload, FileText, Menu } from "lucide-react";




export default function HowToUse() {
  return (
    <>
      <Header />
			<div className="bg-custom-purple min-h-screen">
				<h1 className="text-3xl text-center tracking-[0.4em] text-white py-2">
					使い方
				</h1>
				<hr className="border-t-2 border-white" />

				<div className="max-w-4xl mx-auto mt-5 p-8 bg-custom-purple text-white rounded space-y-12">
					{/* ボタンの説明 */}
					<section>
						<h2 className="px-2 py-1 text-custom-purple text-lg bg-white inline-block rounded">
							ボタンの説明
						</h2>
						<div className="mt-6 space-y-6">
							<div className="items-start">
								<div className="flex space-x-3">
									<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
										<Upload className="w-4 h-4 text-custom-purple" />
									</div>
									<h3 className="text-lg">アップロードボタン</h3>
								</div>
								<div className="mt-4">
									<p className="text-sm">
										データをアップロードする際、
										スキャン、写真を選択、写真を撮るの3つの選択ができます。
									</p>
								</div>
							</div>

							<div className="items-start">
								<div className="flex space-x-3">
									<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
										<FileText className="w-4 h-4 text-custom-purple" />
									</div>
									<h3 className="text-lg">要約カードボタン</h3>
								</div>
								<div className="mt-4">
									<p className="text-sm">
										過去の要約カードを日付ごとに見れます。
									</p>
								</div>
							</div>

							<div className="items-start">
								<div className="flex space-x-3">
									<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
										<img src="/tornado-02-front/image/menu.png" alt="メニューボタン" width="20" />
									</div>
									<h3 className="text-lg">メニューボタン</h3>
								</div>
							</div>
						</div>
					</section>

					{/* 手順 */}
					<section>
						<h2 className="px-2 py-1 text-custom-purple text-xl bg-white inline-block rounded">
							手順
						</h2>
						<ol className="list-inside mt-4 text-sm space-y-4">
							<li>
								❶ アップロードボタンorGoogle検索により、 その日の学習データを蓄積。
							</li>
							<li>
								❷ 1日の要約が完成するとホームの新着の要約を見るから、その日の要約を見ることができます。
							</li>
							<li>
								❸ また、履歴からカレンダーで過去の検索履歴やファイルを見ることも可能です。
							</li>
							<li>
								❹ 分析画面では、
							</li>
						</ol>
					</section>

					{/* 拡張機能 */}
					<section>
						<h2 className="px-2 py-1 text-custom-purple text-xl bg-white inline-block rounded">
							拡張機能について
						</h2>
					</section>
				</div>
			</div>
    </>
  );
}
