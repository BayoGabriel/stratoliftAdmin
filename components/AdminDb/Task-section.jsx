"use client"

import { useState, useEffect } from "react"
import { MdFilePresent } from "react-icons/md"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function TasksSection() {
  const { data: session } = useSession()
  const [emergencyTasks, setEmergencyTasks] = useState([])
  const [serviceTasks, setServiceTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true)
        // Fetch emergency (SOS) tasks
        const sosResponse = await fetch("/api/tasks?type=sos", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const sosData = await sosResponse.json()

        // Fetch service tasks
        const serviceResponse = await fetch("/api/tasks?type=service", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const serviceData = await serviceResponse.json()

        if (sosData.success) {
          setEmergencyTasks(sosData.data)
        } else {
          throw new Error(sosData.message || "Failed to fetch emergency tasks")
        }

        if (serviceData.success) {
          setServiceTasks(serviceData.data)
        } else {
          throw new Error(serviceData.message || "Failed to fetch service tasks")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tasks")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.accessToken) {
      fetchTasks()
    }
  }, [session?.accessToken])

  if (isLoading) {
    return <TasksSectionSkeleton />
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-[600] text-[#1F2633] inter">
            Emergency Tasks{" "}
            <span className="bg-gray-200 font-[600] text-[#1F2633] inter text-sm px-2 py-0.5 rounded ml-2">
              {emergencyTasks.length}
            </span>
          </h2>
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 flex flex-col">
          {emergencyTasks.length > 0 ? (
            emergencyTasks.map((task) => (
              <Link href={`/admin/sos/${task._id}`} key={task._id}>
                <TaskCard task={task} isEmergency={true} />
              </Link>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-100 rounded-lg">
              <p className="text-gray-500">No emergency tasks found</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-[600] text-[#1F2633] inter">
            Service Request Tasks{" "}
            <span className="bg-gray-200 font-[600] text-[#1F2633] inter text-sm px-2 py-0.5 rounded ml-2">
              {serviceTasks.length}
            </span>
          </h2>
          <button className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 flex flex-col">
          {serviceTasks.length > 0 ? (
            serviceTasks.map((task) => (
              <Link href={`/admin/service-ticket/${task._id}`} key={task._id}>
                <TaskCard task={task} isEmergency={false} />
              </Link>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-100 rounded-lg">
              <p className="text-gray-500">No service tasks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task, isEmergency }) {
  // Get status color based on task status
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-[#EAB3081A] text-[#CA8A04]"
      case "Assigned":
        return "bg-[#3B82F61A] text-[#2563EB]"
      case "In Progress":
        return "bg-[#A855F71A] text-[#A855F7]"
      case "Completed":
        return "bg-[#22C55E1A] text-[#22C55E]"
      case "Cancelled":
        return "bg-[#6B72801A] text-[#6B7280]"
      default:
        return "bg-[#EAB3081A] text-[#CA8A04]"
    }
  }

  // Get priority color based on task priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-[#EF44441A] text-[#EF4444]"
      case "High":
        return "bg-[#F97316] text-[#F97316]"
      case "Medium":
        return "bg-[#3B82F61A] text-[#2563EB]"
      case "Low":
        return "bg-[#22C55E1A] text-[#22C55E]"
      default:
        return "bg-[#3B82F61A] text-[#2563EB]"
    }
  }

  // Format date to relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-[45px]">
          <h3 className="font-[700] text-[#1F2633] inter text-[18px]">{task.location}</h3>
          {isEmergency && (
            <span className="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>
        <div className="bg-[#EC32371A] text-[#EC3237] text-[14px] font-[800] px-2 py-[5px] rounded">
          Tech: {task.assignedTo?.firstName || "Unassigned"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <div className="text-[#606C80] text-[12px] font-[800] inter border border-[#EBEEF2] py-[5px] px-[8px] rounded-[16px] inline-block">
            Task ID: {task.taskId}
          </div>
          <div
            className={`${getPriorityColor(task.priority)} text-[12px] font-[800] inter py-[5px] px-[8px] rounded-[16px] inline-block ml-1`}
          >
            Priority: {task.priority}
          </div>
          <div
            className={`${getStatusColor(task.status)} text-[12px] font-[800] inter px-[8px] py-[5px] rounded-[16px] inline-block`}
          >
            Status: {task.status}
          </div>
          <div className="text-xs text-gray-500 mt-1">Created: {getRelativeTime(task.createdAt)}</div>
        </div>
        <div className="flex justify-between flex-col items-end">
          <div className="flex -space-x-2">
            {task.createdBy?.image && (
              <div className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                <Image
                  src={task.createdBy.image || "/placeholder.svg"}
                  alt={`${task.createdBy.firstName}'s profile`}
                  width={28}
                  height={28}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            )}
            {task.assignedTo?.image && (
              <div className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                <Image
                  src={task.assignedTo.image || "/placeholder.svg"}
                  alt={`${task.assignedTo.firstName}'s profile`}
                  width={28}
                  height={28}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            )}
            {!task.assignedTo?.image && task.assignedTo?.name && (
              <div className="h-7 w-7 rounded-full bg-blue-500 text-white border-2 border-white flex items-center justify-center text-xs">
                {task.assignedTo.firstName.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-2">
            <div className="flex items-center space-x-1 text-[#A855F7] px-2 py-1 rounded">
              <MdFilePresent className="h-4 w-4" />
              <span className="text-xs">{task.updates.length}</span>
            </div>
            <div className="flex items-center space-x-1 text-[#F59E0B] px-2 py-1 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="text-xs">{task.updates.length}</span>
            </div>
          </div>
        </div>
      </div>

      {task.description && (
        <div className="mt-2 text-sm text-gray-500 overflow-hidden text-ellipsis line-clamp-2">{task.description}</div>
      )}
    </div>
  )
}

function TasksSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

