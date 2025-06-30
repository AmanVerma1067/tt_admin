import { type Batch, type LoginResponse, ApiError } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

if (!API_URL || !API_KEY) {
  throw new Error("Missing required environment variables: NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_KEY")
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError({
      message: errorText || `HTTP error! status: ${response.status}`,
      status: response.status,
    })
  }

  return response.json()
}

export async function getPublicTimetable(): Promise<Batch[]> {
  try {
    const response = await fetch(`${API_URL}/api/timetable`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    return handleResponse<Batch[]>(response)
  } catch (error) {
    console.error("Failed to fetch public timetable:", error)
    throw error
  }
}

export async function adminLogin(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    return handleResponse<LoginResponse>(response)
  } catch (error) {
    console.error("Admin login failed:", error)
    throw error
  }
}

export async function getRawTimetable(token: string): Promise<Batch[]> {
  try {
    const response = await fetch(`${API_URL}/admin/raw-timetable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      cache: "no-store", // Always fetch fresh data for admin
    })

    return handleResponse<Batch[]>(response)
  } catch (error) {
    console.error("Failed to fetch raw timetable:", error)
    throw error
  }
}

export async function updateTimetable(token: string, data: Batch[]): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/admin/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, data }),
    })

    await handleResponse<void>(response)
  } catch (error) {
    console.error("Failed to update timetable:", error)
    throw error
  }
}
