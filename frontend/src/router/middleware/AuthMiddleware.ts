import { redirect } from "react-router-dom";

export default function AuthMiddleware() {
  const user = localStorage.getItem("user");
  if (user) {
    return redirect("/");
  }
  return null;
}
