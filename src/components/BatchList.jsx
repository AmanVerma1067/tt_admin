"use client"

const BatchList = ({ batches, selectedBatch, onSelectBatch, hasUnsavedChanges }) => {
  const handleBatchSelect = (batchName) => {
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm("You have unsaved changes. Are you sure you want to switch batches?")
      if (!confirmSwitch) return
    }
    onSelectBatch(batchName)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Batches</h2>
        <p className="text-sm text-gray-500 mt-1">
          {batches.length} batch{batches.length !== 1 ? "es" : ""} available
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {batches.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 text-4xl mb-2">📚</div>
            <p className="text-gray-500 text-sm">No batches found</p>
          </div>
        ) : (
          <div className="p-2">
            {batches.map((batch) => (
              <button
                key={batch.batch}
                onClick={() => handleBatchSelect(batch.batch)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  selectedBatch === batch.batch
                    ? "bg-primary-50 border-2 border-primary-200 text-primary-900"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700"
                }`}
                aria-label={`Select batch ${batch.batch}`}
                aria-pressed={selectedBatch === batch.batch}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Batch {batch.batch}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {
                        Object.keys(batch).filter(
                          (key) => key !== "batch" && Array.isArray(batch[key]) && batch[key].length > 0,
                        ).length
                      }{" "}
                      days scheduled
                    </div>
                  </div>
                  {selectedBatch === batch.batch && (
                    <div className="text-primary-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BatchList
