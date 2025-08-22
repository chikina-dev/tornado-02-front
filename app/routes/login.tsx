import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { apiPost } from "../api/auth";
import { useNavigate } from "react-router";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data = await apiPost("/login", { email, password });
      console.log(data);
      if (data.message !== 'Login successful') throw new Error("ログイン失敗");
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return <AuthForm mode="login" error={error || undefined} onSubmit={handleLogin} />;
}
