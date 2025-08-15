import { useEffect } from "react";
import { useNavigate } from "react-router";
import { apiPost } from "../api/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function doLogout() {
      await apiPost("/logout", {});
      navigate("/login");
    }
    doLogout();
  }, [navigate]);

  return <p>ログアウト中...</p>;
}
