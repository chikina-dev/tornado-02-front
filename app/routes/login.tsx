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
      const data = await apiPost("/login", { email, password }, undefined, false);
      console.log(data);
      if (!data.access_token) throw new Error("ログイン失敗");
      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return <AuthForm mode="login" error={error || undefined} onSubmit={handleLogin} />;
}
