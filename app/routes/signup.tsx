import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { apiPost } from "../api/auth";
import { useNavigate } from "react-router";

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data = await apiPost("/create", { email, password });
      console.log(data);
      if (data.message !== "Account created successfully") throw new Error("サインアップ失敗");
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return <AuthForm mode="signup" error={error || undefined} onSubmit={handleSignup} />;
}
