import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { apiPost } from "../api/auth";
import { useNavigate } from "react-router";
import { useLoading } from "~/contexts/LoadingContext";

export default function Signup() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {setLoading} = useLoading();

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    setLoading(true);
    try {
      const data = await apiPost("/create", { email, password }, undefined, false);
      console.log(data);
      if (data.message !== "Account created successfully") throw new Error("サインアップ失敗");
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return <AuthForm mode="signup" error={error || undefined} onSubmit={handleSignup} />;
}
