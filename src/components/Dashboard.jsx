"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { fetchTimetable, updateTimetable } from "../api"
import BatchList from "./BatchList"
import TimetableEditor from "./TimetableEditor"
import Header from "./Header"
import Toast from "./Toast"

const Dashboard = () => {
  const { token } = useAuth()
  const [timetableData, setTimetableData] = useState([])
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [localChanges, setLocalChanges] = useState({})

  // Fetch timetable data on component mount
  useEffect(() => {
    loadTimetableData()
  }, [token])

  const loadTimetableData = async () => {
    try {
      setLoading(true)
      const data = await fetchTimetable(token)
      setTimetableData(data)

      // Select first batch by default if none selected
      if (!selectedBatch && data.length > 0) {
        setSelectedBatch(data[0].batch)
      }
    } catch (error) {
      showToast("Failed to load timetable data", "error")
      console.error("Load timetable error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (Object.keys(localChanges).length === 0) {
      showToast("No changes to save", "info")
      return
    }

    try {
      setSaving(true)

      // Merge local changes with existing data
      const updatedData = timetableData.map((batch) => {
        if (localChanges[batch.batch]) {
          return { ...batch, ...localChanges[batch.batch] }
        }
        return batch
      })

      await updateTimetable(token, updatedData)

      // Clear local changes and reload data
      setLocalChanges({})
      await loadTimetableData()

      showToast("Timetable updated successfully", "success")
    } catch (error) {
      showToast(error.message || "Failed to save changes", "error")
      console.error("Save error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleBatchChange = (batchData) => {
    setLocalChanges((prev) => ({
      ...prev,
      [selectedBatch]: batchData,
    }))
  }

  const showToast = (message, type = "info") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const getCurrentBatchData = () => {
    if (!selectedBatch) return null

    // Return local changes if available, otherwise original data
    if (localChanges[selectedBatch]) {
      return localChanges[selectedBatch]
    }

    return timetableData.find((batch) => batch.batch === selectedBatch)
  }

  const hasUnsavedChanges = Object.keys(localChanges).length > 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSave={handleSave} saving={false} hasChanges={false} />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            <span className="text-gray-600">Loading timetable data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSave={handleSave} saving={saving} hasChanges={hasUnsavedChanges} />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Left Column - Batch List */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex-shrink-0">
          <BatchList
            batches={timetableData}
            selectedBatch={selectedBatch}
            onSelectBatch={setSelectedBatch}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>

        {/* Right Column - Timetable Editor */}
        <div className="flex-1 overflow-hidden">
          {selectedBatch ? (
            <TimetableEditor batchData={getCurrentBatchData()} onDataChange={handleBatchChange} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Batch</h3>
                <p className="text-gray-500">Choose a batch from the left panel to edit its timetable</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Dashboard
