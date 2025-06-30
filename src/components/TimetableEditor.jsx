"use client"

import { useState, useEffect } from "react"

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const TimetableEditor = ({ batchData, onDataChange }) => {
  const [localData, setLocalData] = useState({})

  // Initialize local data when batchData changes
  useEffect(() => {
    if (batchData) {
      const initialData = {}
      WEEKDAYS.forEach((day) => {
        initialData[day] = batchData[day] || []
      })
      setLocalData(initialData)
    }
  }, [batchData])

  // Notify parent of changes
  useEffect(() => {
    if (Object.keys(localData).length > 0) {
      onDataChange({ ...batchData, ...localData })
    }
  }, [localData, batchData, onDataChange])

  const addSession = (day) => {
    setLocalData((prev) => ({
      ...prev,
      [day]: [...prev[day], { time: "", subject: "", room: "", teacher: "" }],
    }))
  }

  const removeSession = (day, index) => {
    setLocalData((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }))
  }

  const updateSession = (day, index, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      [day]: prev[day].map((session, i) => (i === index ? { ...session, [field]: value } : session)),
    }))
  }

  if (!batchData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Batch Selected</h3>
          <p className="text-gray-500">Select a batch from the left panel to edit its timetable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Batch {batchData.batch} Timetable</h2>
          <p className="text-gray-600 mt-1">Edit the weekly schedule for this batch</p>
        </div>

        <div className="space-y-6">
          {WEEKDAYS.map((day) => (
            <div key={day} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{day}</h3>
                  <button
                    onClick={() => addSession(day)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                    aria-label={`Add new session for ${day}`}
                  >
                    <svg className="-ml-0.5 mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Session
                  </button>
                </div>
              </div>

              <div className="p-6">
                {localData[day]?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📝</div>
                    <p className="text-gray-500 text-sm">No sessions scheduled for {day}</p>
                    <button
                      onClick={() => addSession(day)}
                      className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Add the first session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header row for larger screens */}
                    <div className="hidden md:grid md:grid-cols-5 gap-4 text-sm font-medium text-gray-700 pb-2 border-b border-gray-200">
                      <div>Time</div>
                      <div>Subject</div>
                      <div>Room</div>
                      <div>Teacher</div>
                      <div>Actions</div>
                    </div>

                    {localData[day]?.map((session, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <label className="block md:hidden text-xs font-medium text-gray-700">Time</label>
                          <input
                            type="text"
                            value={session.time}
                            onChange={(e) => updateSession(day, index, "time", e.target.value)}
                            placeholder="e.g., 9:00-10:00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            aria-label={`Time for ${day} session ${index + 1}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block md:hidden text-xs font-medium text-gray-700">Subject</label>
                          <input
                            type="text"
                            value={session.subject}
                            onChange={(e) => updateSession(day, index, "subject", e.target.value)}
                            placeholder="Subject name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            aria-label={`Subject for ${day} session ${index + 1}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block md:hidden text-xs font-medium text-gray-700">Room</label>
                          <input
                            type="text"
                            value={session.room}
                            onChange={(e) => updateSession(day, index, "room", e.target.value)}
                            placeholder="Room number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            aria-label={`Room for ${day} session ${index + 1}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block md:hidden text-xs font-medium text-gray-700">Teacher</label>
                          <input
                            type="text"
                            value={session.teacher}
                            onChange={(e) => updateSession(day, index, "teacher", e.target.value)}
                            placeholder="Teacher name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            aria-label={`Teacher for ${day} session ${index + 1}`}
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={() => removeSession(day, index)}
                            className="w-full md:w-auto inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            aria-label={`Remove ${day} session ${index + 1}`}
                          >
                            <svg className="h-4 w-4 md:mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="hidden md:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TimetableEditor
