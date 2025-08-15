import ErrorMessage from "./ErrorMessage";

interface AuthFormProps {
  mode: "login" | "signup";
  error?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AuthForm({ mode, error, onSubmit }: AuthFormProps) {
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        {mode === "login" ? "ログイン" : "サインアップ"}
      </h1>

      <ErrorMessage message={error} />

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="メールアドレス"
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="password"
          type="password"
          placeholder="パスワード"
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          {mode === "login" ? "ログイン" : "登録"}
        </button>
      </form>
    </div>
  );
}
