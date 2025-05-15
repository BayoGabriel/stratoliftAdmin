"use client"
import { useEffect, useState } from "react"
import { FaMapMarkerAlt, FaClock } from "react-icons/fa"
import Link from "next/link"
import engineer from "@/public/engineer.png"
import Image from "next/image"
export default function TechnicianManagement() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTechnicians() {
      try {
        const response = await fetch("/api/technicianlist")
        if (!response.ok) {
          throw new Error("Failed to fetch technicians")
        }
        const data = await response.json()
        setTechnicians(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  if (loading)
    return (
      <div className="flex flex-col md:flex-row gap-4 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
          <h2 className="text-lg font-bold mb-6">ALL TECHNICIANS</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 animate-pulse">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:w-96">
          <h2 className="text-lg font-bold mb-6">TECHNICIANS ON DUTY</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="ml-3">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>

  // All technicians with data from backend
  const allTechnicians = technicians.map((tech) => ({
    id: tech._id,
    name: tech.firstName,
    location: tech.address || "Abuja",
    status: tech.status || "Active",
    image: tech.image || engineer,
    lastSeen: tech.lastSeen || null,
    assignedTasksCount: tech.assignedTasksCount || 0,
  }))

  // Technicians on duty (those who have been assigned to a task)
  const techniciansOnDuty = technicians
    .filter((tech) => tech.isOnDuty)
    .map((tech) => ({
      id: tech._id,
      name: tech.firstName + " " + tech.lastName,
      status: tech.status,
      image: tech.image || engineer,
      assignedTasksCount: tech.assignedTasksCount || 0,
      action: "Assign",
    }))

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
        <h2 className="text-lg font-bold mb-6">ALL TECHNICIANS</h2>
        <div className="space-y-4">
          {allTechnicians.map((tech) => (
            <Link href={`/admin/technicians/${tech.id}`} key={tech.id}>
              <div className="flex items-center justify-between border-b pb-4 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
                <div className="flex items-center">
                  <div className="relative">
                    <Image
                      src={tech.image || engineer}
                      alt={tech.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div
                      className={`absolute top-0 right-1 w-3 h-3 rounded-full ${
                        tech.status === "Active" ? "bg-green-500" : "bg-gray-400"
                      } border-2 border-white`}
                    ></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium capitalize">{tech.name}</h3>
                    <p className="text-gray-500 text-sm flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" size={12} />
                      {tech.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {tech.lastSeen ? (
                    <span className="text-gray-500 text-sm flex items-center justify-end">
                      <FaClock className="mr-1" size={12} />
                      {tech.lastSeen}
                    </span>
                  ) : (
                    <div>
                      <span className={`text-sm ${tech.status === "Active" ? "text-green-600" : "text-gray-500"}`}>
                        {tech.status}
                      </span>
                      {tech.assignedTasksCount > 0 && (
                        <p className="text-xs text-blue-500">{tech.assignedTasksCount} tasks assigned</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* TECHNICIANS ON DUTY PANEL */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:w-96">
        <h2 className="text-lg font-bold mb-6">TECHNICIANS ON DUTY</h2>
        <div className="space-y-4">
          {techniciansOnDuty.length > 0 ? (
            techniciansOnDuty.map((tech) => (
              <Link href={`/admin/technicians/${tech.id}`} key={tech.id}>
                <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
                  <div className="flex items-center">
                    <div className="relative">
                      <Image
                        src={tech.image || engineer}
                        alt={tech.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div
                        className={`absolute top-0 right-1 w-2.5 h-2.5 rounded-full ${
                          tech.status === "Active" ? "bg-green-500" : "bg-gray-400"
                        } border-2 border-white`}
                      ></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-sm">{tech.name}</h3>
                      <p className="text-xs text-green-600">
                        {tech.assignedTasksCount} {tech.assignedTasksCount === 1 ? "task" : "tasks"} assigned
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded text-sm font-medium bg-green-500 text-white"
                    onClick={(e) => {
                      e.preventDefault() // Prevent navigation when clicking the button
                      // Add your assign logic here
                    }}
                  >
                    {tech.action}
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No technicians currently on duty</p>
          )}
        </div>
      </div>
    </div>
  )
}

