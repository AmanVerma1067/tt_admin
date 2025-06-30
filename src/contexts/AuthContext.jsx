"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token in sessionStorage on app load
    const savedToken = sessionStorage.getItem("adminToken")
    if (savedToken) {
      setToken(savedToken)
    }
    setLoading(false)
  }, [])

  const login = (newToken) => {
    setToken(newToken)
    sessionStorage.setItem("adminToken", newToken)
  }

  const logout = () => {
    setToken(null)
    sessionStorage.removeItem("adminToken")
  }

  const value = {
    token,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
