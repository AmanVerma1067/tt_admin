import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

async function validateAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("jwt")?.value

  if (!token) {
    redirect("/admin/login")
  }

  return token
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await validateAuth()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
