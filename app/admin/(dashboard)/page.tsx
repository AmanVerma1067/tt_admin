import { cookies } from "next/headers"
import { getRawTimetable } from "@/lib/api"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Card } from "@/components/ui/card"

async function AdminContent() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")?.value

    if (!token) {
      throw new Error("No authentication token")
    }

    const batches = await getRawTimetable(token)
    return <AdminDashboard initialBatches={batches} />
  } catch (error) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to Load Admin Data</h2>
        <p className="text-muted-foreground">Unable to fetch timetable data. Please check your authentication.</p>
      </Card>
    )
  }
}

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Timetable Admin</h1>
        <p className="text-muted-foreground">Manage and edit academic timetables</p>
      </div>

      <AdminContent />
    </div>
  )
}
