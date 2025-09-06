import type { Route } from "./+types/privacy";
import Header from "~/components/Header";

export function meta({}: Route.MetaArgs) {
  const title = "Privacy Policy | Viofolio";
  const description =
    "本ページは拡張機能のプライバシーポリシーです。収集するデータの種類、利用目的、共有範囲、保存期間、ユーザーのコントロール、セキュリティ、連絡先などを記載しています。";
  const url = "https://viofolio.com/privacy";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { name: "robots", content: "index,follow" },
  ];
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "2025-09-07"; // 最終更新日を都度更新

  return (
    <div className="min-h-screen bg-custom-purple">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-10 leading-relaxed text-white">
        <h1 id="privacy-policy" className="text-3xl font-bold mb-6">
          プライバシーポリシー
        </h1>

        <p className="text-sm text-gray-300 mb-10">最終更新日: {lastUpdated}</p>

        <section className="mb-10">
          <h2 id="overview" className="text-xl font-semibold mb-3">
            拡張機能の概要
          </h2>
          <p>
            本プライバシーポリシーは、Viofolio（以下、「本拡張機能」）が Chrome
            拡張としてユーザーの作業を支援する際の個人情報・関連情報の取扱いについて説明するものです。本拡張機能はユーザーのブラウジング体験を支援する目的で動作します。
          </p>
        </section>

        <section className="mb-10">
          <h2 id="data-types" className="text-xl font-semibold mb-3">
            収集するデータの種類
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              利用ログ（機能の使用回数、エラー情報、パフォーマンス指標 など）
            </li>
            <li>
              設定情報（ユーザーが拡張機能内で設定したオプション、フラグ、トークン格納の有無）
            </li>
            <li>
              コンテンツへのアクセス情報（アクティブタブURLや選択テキストの処理有無
              など、機能提供に必要な最小限の範囲）
            </li>
            <li>
              個人を直接識別しないテクニカル情報（ブラウザ種別、拡張機能のバージョン、OS情報
              等）
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-300">
            ※
            本拡張機能は、機能上必要な場合を除き、クレジットカード番号等の機微情報を収集しません。必要となる場合は明示の上、同意取得を行います。
          </p>
        </section>

        <section className="mb-10">
          <h2 id="purposes" className="text-xl font-semibold mb-3">
            データの利用目的
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>拡張機能の提供、維持、改善のため</li>
            <li>不具合の検知、セキュリティ対策、不正利用防止のため</li>
            <li>ユーザーサポート対応のため</li>
            <li>
              外部API（例: OpenAI API
              等）を利用した機能提供のため（必要に応じてデータを送信）
            </li>
            <li>法令遵守や紛争解決のため</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 id="sharing" className="text-xl font-semibold mb-3">
            データの送信・共有範囲
          </h2>
          <p className="mb-2">
            本拡張機能は、上記の目的達成に必要な範囲で以下の第三者へデータを送信・共有する場合があります。
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              インフラ/解析事業者（Vercel, Cloudflare, Google Analytics など）
            </li>
            <li>機能提供先API（OpenAI, 自社API, 連携SaaS など）</li>
            <li>法令に基づき開示が必要な公的機関等</li>
          </ul>
          <p className="mt-3 text-sm text-gray-300">
            共有は必要最小限とし、可能な限り匿名化・仮名化等を行います。
          </p>
        </section>

        <section className="mb-10">
          <h2 id="retention" className="text-xl font-semibold mb-3">
            データの保存場所と期間
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              保存場所：ユーザーのブラウザのストレージ（chrome.storage
              等）／自社サーバー（リージョン: 例 日本/米国/EU）
            </li>
            <li>
              保存期間：目的達成に必要な期間のみ保存し、不要となったデータは合理的な方法で削除または匿名化します。
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 id="control" className="text-xl font-semibold mb-3">
            ユーザーのコントロール範囲
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              設定画面からのオプション変更、データ送信のオン/オフ（可能な限り提供）
            </li>
            <li>保存データの閲覧・削除請求（合理的範囲で対応）</li>
            <li>本拡張機能のアンインストールによりデータ収集を停止可能</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 id="security" className="text-xl font-semibold mb-3">
            セキュリティ
          </h2>
          <p>
            本拡張機能は、データの機密性・完全性を保護するために、通信の暗号化（HTTPS/TLS）やアクセス制御、監査ログ等の適切な技術的・組織的対策を講じます。
            ただし、インターネット上の完全な安全性を保証するものではありません。
          </p>
        </section>

        <section className="mb-10">
          <h2 id="contact" className="text-xl font-semibold mb-3">
            連絡先
          </h2>
          <p>
            本ポリシーに関するお問い合わせは、以下までご連絡ください。
            <br />
            メール:{" "}
            <a className="underline" href="mailto:contact@viofolio.com">
              contact@viofolio.com
            </a>
            <br />
            運営者: Mon-manga
            <br />
          </p>
        </section>

        <hr className="my-10" />

        <p className="text-xs text-gray-300">
          本プライバシーポリシーは、法令の変更やサービス内容の改定等に応じて更新される場合があります。重要な変更がある場合は、本ページで告知します。
        </p>
      </main>
    </div>
  );
}
