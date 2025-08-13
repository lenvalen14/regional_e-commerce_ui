import { redirect } from "next/navigation"

export default function AdminPage() {
  // Redirect to login page for now
  redirect("/admin/login")
}
