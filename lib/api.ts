// API configuration and typed fetch functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://timetable-api-9xsz.onrender.com"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "tt_api_key"

// Types
export interface Session {
  time: string
  subject: string
  room: string
  teacher: string
}

export interface Batch {
  batch: string
  Monday?: Session[]
  Tuesday?: Session[]
  Wednesday?: Session[]
  Thursday?: Session[]
  Friday?: Session[]
  Saturday?: Session[]
  [key: string]: any
}

export interface LoginResponse {
  token: string
  message?: string
}

// Public API functions
export async function getPublicTimetable(): Promise<Batch[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/timetable`, {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch timetable: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Get public timetable error:", error)
    throw new Error("Failed to fetch timetable data")
  }
}

// Admin API functions
export async function adminLogin(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Login failed: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Admin login error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Login failed. Please check your credentials.")
  }
}

export async function getRawTimetable(token: string): Promise<Batch[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/raw-timetable`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data for admin
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.")
      }
      throw new Error(`Failed to fetch raw timetable: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Get raw timetable error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch timetable data")
  }
}

export async function updateTimetable(token: string, data: Batch[]): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, data }),
    })

    const result = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please login again.")
      }
      throw new Error(result.message || `Update failed: ${response.status}`)
    }

    return result
  } catch (error) {
    console.error("Update timetable error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to update timetable")
  }
}

// Utility function to validate session data
export function validateSession(session: Partial<Session>): session is Session {
  return !!(session.time && session.subject && session.room && session.teacher)
}

// Utility function to get weekdays
export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const
export type Weekday = (typeof WEEKDAYS)[number]
