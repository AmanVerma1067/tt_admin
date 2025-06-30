"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, User } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear JWT cookie
    document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.push("/admin/login")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span className="font-medium">Administrator</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
