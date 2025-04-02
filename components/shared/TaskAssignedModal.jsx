// components/TaskAssignedModal.jsx
import React from "react";

export default function TaskAssignedModal({ isOpen, onClose, technician }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#EFF0F036] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 rounded-full p-3">
            <svg 
              className="w-8 h-8 text-green-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-1">TASK ASSIGNED!</h3>
        <p className="text-sm text-red-500 mb-4">
          The technician will be notified today
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}