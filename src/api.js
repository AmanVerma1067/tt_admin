// API configuration and functions
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000"

/**
 * Login function to authenticate admin
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @returns {Promise<Object>} Response with token or error
 */
export const login = async (username, password) => {
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
      throw new Error(data.message || "Login failed")
    }

    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

/**
 * Fetch timetable data for all batches
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} Timetable data
 */
export const fetchTimetable = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/raw-timetable`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch timetable")
    }

    return data
  } catch (error) {
    console.error("Fetch timetable error:", error)
    throw error
  }
}

/**
 * Update timetable data
 * @param {string} token - JWT token for authentication
 * @param {Array} data - Timetable data to update
 * @returns {Promise<Object>} Update response
 */
export const updateTimetable = async (token, data) => {
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
      throw new Error(result.message || "Failed to update timetable")
    }

    return result
  } catch (error) {
    console.error("Update timetable error:", error)
    throw error
  }
}
