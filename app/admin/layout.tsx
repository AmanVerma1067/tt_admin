import React from "react"
import type { ReactElement } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

async function validateAuth(pathname: string) {
  // Skip auth check for login page
  if (pathname === "/admin/login") {
    return null
  }

  const cookieStore = await cookies()
  const token = cookieStore.get("jwt")?.value

  if (!token) {
    redirect("/admin/login")
  }

  return token
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<ReactElement> {
  // Get the current pathname - we'll need to pass this from the page
  // For now, let's check if we're on the login page by checking the children
  const isLoginPage = React.isValidElement(children) && children.props?.searchParams !== undefined

  if (!isLoginPage) {
    await validateAuth("/admin")
  }

  // If this is the login page, render without sidebar/header
  if (isLoginPage) {
    return <>{children}</>
  }

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

export function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
