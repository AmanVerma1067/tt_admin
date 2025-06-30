import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

async function checkAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin-token")

  if (!token) {
    redirect("/admin/login")
  }

  return token.value
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await checkAuth()

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar token={token} />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
