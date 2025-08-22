import { Link } from "react-router";
import ErrorMessage from "~/components/ErrorMessage";
import Header from "~/components/Header";

interface AuthFormProps {
  mode: "login" | "signup";
  error?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AuthForm({ mode, error, onSubmit }: AuthFormProps) {
  return (
    <>
      <Header />
      <div className="bg-custom-purple min-h-screen">
        <h1 className="text-3xl text-center tracking-[0.4em] text-white py-0.5">
          お問い合わせ
        </h1>
        <hr className="border-t-2 border-white" />
        <div className="max-w-md mx-auto mt-20 p-8 bg-custom-purple text-white rounded">
          <ErrorMessage message={error} />

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                氏名
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-white bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-white bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
						<div>
							<label htmlFor="content" className="block text-sm mb-1">
								お問い合わせ内容
							</label>
							<textarea
								id="content"
								name="content"
								required
								rows={5} // 行数指定で大きさ調整
								className="w-full px-4 py-2 border border-white bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
							/>
						</div>

            {/* ボタン */}
            <button
              type="submit"
              className="w-full py-3 border border-white text-white text-2xl tracking-[0.4em] transition hover:bg-white hover:text-custom-purple"
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
