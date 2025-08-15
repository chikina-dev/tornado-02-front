export default function LogoutButton() {
  return (
    <form method="post" action="/logout">
      <button type="submit">ログアウト</button>
    </form>
  );
}
