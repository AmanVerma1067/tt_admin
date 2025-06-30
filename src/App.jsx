"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { token } = useAuth()
  return !token ? children : <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
