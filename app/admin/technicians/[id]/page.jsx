"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { FaCheckCircle, FaHourglassHalf, FaExclamationTriangle } from "react-icons/fa"
import engineer from "@/public/engineer.png"
import Link from "next/link"

const TechnicianProfileSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100 min-h-screen animate-pulse">
      {/* Left Column */}
      <div className="w-full">
        {/* Profile Card Skeleton */}
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className="w-[60px] h-[60px] rounded-full bg-gray-300"></div>
              <span className="w-2 h-2 rounded-full absolute top-1 right-2 bg-gray-400"></span>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="h-6 bg-gray-300 rounded w-40"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-1 bg-gray-400"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Card Skeleton */}
        <div className="bg-white rounded-lg mt-10 shadow-sm min-w-[635px]">
          <div className="w-full flex items-center justify-between p-8 border-b-[1px] border-[#DED9DD]">
            <div className="h-5 bg-gray-300 rounded w-24"></div>
            <div className="border p-1 rounded-[10px] h-6 bg-gray-300 w-20"></div>
          </div>
          <div className="space-y-4 p-8 flex flex-col">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex justify-between">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            ))}
            <div className="flex items-center justify-center mt-6 gap-8 w-full">
              <div className="h-12 bg-gray-300 rounded-[10px] w-32"></div>
              <div className="h-12 bg-gray-300 rounded-[10px] w-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-7 bg-gray-300 rounded w-48 mx-auto my-5"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-5 bg-gray-300 rounded w-40 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-48"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-gray-300 rounded-full w-20 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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

  if (loading) return <TechnicianProfileSkeleton />
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
      <div className="w-full">
        {/* Profile Card */}
        <div className="mb-4">
          <div className="flex items-start gap-3">
            <div className="relative">
            <Image
              src={technician.image || engineer}
              alt="Profile picture"
              width={60}
              height={60}
              className="rounded-full border-2 border-green-500"
            />
            <span className={`w-2 h-2 rounded-full absolute top-1 right-2 ${technician.status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="font-[600] inter text-lg text-[20px] ">
                <span>{technician.firstName} </span>
                <span>{technician.lastName}</span>
              </div>
              <Link href={`mailto:${technician.email}`} className="text-[14px] inter">
                {technician.email}
              </Link>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${technician.status === "Active" ? "bg-green-500" : "bg-slate-300"}`}
                ></div>
                <span className="text-xs text-gray-500">{technician.location || "Abuja, Nigeria"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className="bg-white rounded-lg mt-10 shadow-sm min-w-[635px]">
          <div className="w-full flex items-center justify-between p-8 border-b-[1px] border-[#DED9DD]">
            <h3 className="font-medium mb-4">Basic Data</h3>
            <div className={`border p-1 rounded-[10px] text-[12px] font-[400] flex items-center gap-1 ${technician.status === "Active" ? "border-[#65A30D] text-[#65A30D] bg-[#F7FEE7]" : "text-slate-600 bg-slate-50 border-slate-600"}`}>
              <span className={`w-2 h-2 rounded-full mr-1 ${technician.status === "Active" ? "bg-green-500" : "bg-slate-300"}`}></span>
              {technician.status}
            </div>
          </div>
          <div className="space-y-4 p-8 flex flex-col ">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Technician ID:</span>
              <span className="text-sm font-medium">#{technician._id}</span>
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
              <span className="text-gray-500 text-sm">Assigned Tasks:</span>
              <span className="text-sm font-medium">{technician.assignedTasks?.length || 0}</span>
            </div>
            <div className="flex items-center justify-center mt-6 gap-8 w-full">
              <button className="bg-white text-black border-2 border-black px-6 py-3 font-[700] inter text-[16px] rounded-[10px]">Terminate</button>
              <button className="bg-[#EC3237] text-white px-6 py-3 font-[700] inter text-[16px] rounded-[10px]">Suspend</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-[20px] inter font-[700] text-center p-5">ASSIGNED TASKS</h3>
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
                        Created by: {task.createdBy?.firstName || "Unknown"} on {formatDate(task.createdAt)}
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