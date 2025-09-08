import Header from "~/components/Header";
import { Upload, FileText, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuthCheck } from "~/hooks/useAuthCheck";
import { useLoading } from "~/contexts/LoadingContext";

export default function HowToUse() {
	const [openInstall, setOpenInstall] = useState(true);
	const [openUsage, setOpenUsage] = useState(true);

	const isAuthenticated = useAuthCheck();
	const { loading, setLoading } = useLoading();

  useEffect(() => {
    if (isAuthenticated === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, setLoading]);

  return (
    <div className="bg-custom-purple min-h-screen w-full overflow-x-hidden">
      <Header />
			<div>
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
										データをアップロードする際、「写真を選択」、「写真を撮る」の2つの選択ができます。
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
										過去の要約カードを日付ごとに確認できます。カレンダーマークをタップして日付を変更すると、その日の要約を表示できます。
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
								<div className="mt-4">
									<p className="text-sm">
										画面右上のアイコンをタップすると、アプリ内のページ一覧が表示されます。
									</p>
								</div>
							</div>
						</div>
					</section>

					{/* 手順 */}
					<section>
						<h2 className="px-2 py-1 text-custom-purple text-xl bg-white inline-block rounded">
							学習手順
						</h2>
						<ol className="list-inside mt-4 text-sm space-y-4">
							<li>
								❶ アップロードボタンまたはGoogle検索により、その日の学習データを蓄積。
							</li>
							<li>
								❷ 1日の要約が完成すると、ホームの「新着の要約を見る」にNEWマークが表示されます。タップすると、その日の要約を確認できます。（0時に更新）
							</li>
							<li>
								❸ また、履歴ページからカレンダーで投稿した日付を選択することで、過去の検索履歴やファイルを見ることも可能です。
							</li>
							<li>
								❹ 記録がたまると、分析結果ページから過去の学習内容の総評などを確認することもできます
							</li>
						</ol>
					</section>

					{/* 拡張機能 */}
					<section>
						<h2 className="px-2 py-1 text-custom-purple text-xl bg-white inline-block rounded mb-2">
							拡張機能について
						</h2>
						<p>
							拡張機能を使うと、Google Chromeで調べ物をするだけで、そのサイトで学習したことを記録として残すことができます。<br />
							以下では、導入方法とその設定方法について説明します。
						</p>
						<h3
							className="text-md mt-4 cursor-pointer flex"
							onClick={() => setOpenInstall(!openInstall)}	
						>
							＜ 導入方法 ＞
							{openInstall ? (
								<ChevronDown className="w-6 h-6" />
							) : (
								<ChevronUp className="w-6 h-6" />
							)}
						</h3>
						{openInstall && <ol className="list-inside text-sm space-y-4 mb-10">
							<li>
								① dist.zipをダウンロード
								<div className="pt-4 pl-4 pb-2">
									<a
										href="/tornado-02-front/dist.zip"
										download
										className="border-b"
									>
										dist.zipをダウンロードする
									</a>
								</div>
							</li>
							<li>
								② dist.zipを展開
							</li>
							<li>
								③ Chromeから拡張機能タブをクリック
								<img src="/tornado-02-front/image/description1.png" alt="" className="mt-4 mb-10"/>
								<img src="/tornado-02-front/image/description2.png" alt="" className="mt-10 mb-10"/>
							</li>
							<li>
								④ 右上にあるデベロッパーモードをオンにし、ヘッダーの下部に表示される「パッケージ化されていない拡張機能を読み込む」を選択
								<img src="/tornado-02-front/image/description3.png" alt="" className="mt-4 mb-10"/>
							</li>
							<li>
								⑤ 配布された「dist」フォルダを展開すると、中に「dist」フォルダと「__MACOSX」フォルダが作成されます。「dist」フォルダが実際に使うファイルです。「__MACOSX」フォルダはMacのシステム用の補助ファイルで、導入には必要ありません。導入する際は「dist」フォルダだけを挿入してください。以上で導入が完了しました。
								<img src="/tornado-02-front/image/description4.png" alt="" className="mt-4 mb-10"/>
							</li>
						</ol>
						}
						<h3
							className="text-md mt-4 cursor-pointer flex"
							onClick={() => setOpenUsage(!openUsage)}	
						>
							＜ 使用方法 ＞
							{openUsage ? (
								<ChevronDown className="w-6 h-6" />
							) : (
								<ChevronUp className="w-6 h-6" />
							)}
						</h3>
						{openUsage && <ol className="list-inside text-sm space-y-4 mb-10">
							<li>
								① 拡張機能一覧から「Viofolio」を選択する。
								<img src="/tornado-02-front/image/description6.png" alt="" className="mt-4 mb-10"/>
							</li>
							<li>
								② 「オプション」ボタンをクリックし、Viofolio内で登録したメールアドレスとパスワードでログインしてください。
								<img src="/tornado-02-front/image/description7.png" alt="" className="mt-4 mb-10"/>
							</li>
							<li>
								③ 「収集設定」のボタンを有効にすることで、検索ログの収集を開始します。<br/>「収集間隔の設定」でどれだけ同じサイトに滞在するとログの収集するかの条件を設定することができます。
								<img src="/tornado-02-front/image/description8.png" alt="" className="mt-4 mb-10"/>
							</li>
							<li>
								④ 「URLフィルタ設定」では、情報を収集するURLに制限をかけることができます。「ブラックリスト」に設定したパターンに一致するURLは収集しないように設定できます。「ホワイトリスト」ではパターンに一致するURLのみ収集するように設定できます。<br />特に制限がない場合は、「ブラックリスト」のタブを選択しておいてください。
								<img src="/tornado-02-front/image/description9.png" alt="" className="mt-4 mb-10"/>
							</li>
							<li>
								⑤ 「収集設定」をオンにした状態で実際にサイトにアクセスすると、サイトの情報を収集し、検索履歴に表示されます。「Viofolio」ではこの履歴をもとに分析を行います。
								<img src="/tornado-02-front/image/description10.png" alt="" className="mt-4 mb-10"/>
							</li>
						</ol>
						}
					</section>
				</div>
			</div>
    </div>
  );
}
