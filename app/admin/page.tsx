import { cookies } from "next/headers"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin-token")?.value

  if (!token) {
    return null // This will be handled by the layout redirect
  }

  return <AdminDashboard token={token} />
}
