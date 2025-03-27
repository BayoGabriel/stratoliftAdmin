"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { FaCheckCircle, FaHourglassHalf, FaExclamationTriangle } from "react-icons/fa"

export default function TechnicianProfile() {
  const { id } = useParams()
  const [technician, setTechnician] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const response = await fetch(`/api/technicianlist/individual?id=${id}`, {
          cache: "no-store",
        })

        if (!response.ok) throw new Error("Failed to fetch technician details")

        const data = await response.json()
        setTechnician(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTechnician()
  }, [id])

  if (loading) return <p className="p-6">Loading technician details...</p>
  if (error) return <p className="text-red-500 p-6">{error}</p>

  // Get status icon based on task status
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />
      case "in_progress":
        return <FaHourglassHalf className="text-blue-500" />
      case "pending":
        return <FaExclamationTriangle className="text-yellow-500" />
      default:
        return <FaExclamationTriangle className="text-gray-500" />
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100 min-h-screen">
      {/* Left Column */}
      <div className="w-full md:w-1/3">
        {/* Profile Card */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Image
              src={technician.image || "/placeholder.svg?height=60&width=60"}
              alt="Profile picture"
              width={60}
              height={60}
              className="rounded-full border-2 border-blue-500"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-lg text-blue-600">{technician.name}</h2>
              <a href={`mailto:${technician.email}`} className="text-sm text-blue-500">
                {technician.email}
              </a>
              <div className="flex items-center mt-1">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${technician.status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="text-xs text-gray-500">{technician.status || "Active"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-4">Basic info</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Technician ID:</span>
              <span className="text-sm font-medium">{technician._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Phone:</span>
              <span className="text-sm font-medium">{technician.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Address:</span>
              <span className="text-sm font-medium text-right">{technician.address || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Location:</span>
              <span className="text-sm font-medium">{technician.location || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Assigned Tasks:</span>
              <span className="text-sm font-medium">{technician.assignedTasks?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-4">ASSIGNED TASKS</h3>
          <div className="space-y-3">
            {technician.assignedTasks?.length > 0 ? (
              technician.assignedTasks.map((task) => (
                <div key={task._id} className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(task.status)}
                    </div>
                    <div>
                      <p className="font-medium">{task.title || "Untitled Task"}</p>
                      <p className="text-xs text-gray-500">Task ID: {task._id}</p>
                      <p className="text-xs text-gray-500">
                        Created by: {task.createdBy?.name || "Unknown"} on {formatDate(task.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status === "completed"
                        ? "Completed"
                        : task.status === "in_progress"
                          ? "In Progress"
                          : "Pending"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {task.dueDate ? `Due: ${formatDate(task.dueDate)}` : "No due date"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tasks assigned to this technician.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

