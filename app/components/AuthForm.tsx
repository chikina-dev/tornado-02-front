import { Link } from "react-router";
import ErrorMessage from "./ErrorMessage";
import Header from "./Header";

interface AuthFormProps {
  mode: "login" | "signup";
  error?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AuthForm({ mode, error, onSubmit }: AuthFormProps) {
  return (
    <div className="bg-custom-purple min-h-screen w-full overflow-x-hidden">
      <Header />
      <div>
        <h1 className="text-3xl text-center tracking-[0.4em] text-white py-0.5">
          {mode === "login" ? "ログイン" : "サインアップ"}
        </h1>
        <hr className="border-t-2 border-white" />
        <div className="max-w-md mx-auto mt-20 p-8 bg-custom-purple text-white rounded">
          <ErrorMessage message={error} />

          <form onSubmit={onSubmit} className="space-y-4">
            {/* メールアドレス */}
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

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-white bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
              />
              <div className="text-right mt-1">
                {mode === "login" ? (
                  <Link to="/signup" className="text-xs text-white hover:underline tracking-[0.2em]">
                    新規登録する →
                  </Link>

                ): (
                  <Link to="/login" className="text-xs text-white hover:underline tracking-[0.2em]">
                    ログインする →
                  </Link>                  
                )}
              </div>
            </div>

            {/* ボタン */}
            <button
              type="submit"
              className="w-full py-3 border border-white text-white text-2xl tracking-[0.4em] transition hover:bg-white hover:text-custom-purple"
            >
              {mode === "login" ? "ログイン" : "登録"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
