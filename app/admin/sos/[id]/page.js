"use client"

import { useState, useEffect } from "react"
import ElevatorTicket from "@/components/AdminDb/ElevatorTicket"
import { toast } from "sonner"

export default function TicketPage({ params }) {
  const [ticketData, setTicketData] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTechnician, setSelectedTechnician] = useState(null)

  useEffect(() => {
    // Fetch ticket data
    const fetchTicketData = async () => {
      try {
        const response = await fetch(`/api/tasks/individualtask/${params.id}`)
        const result = await response.json()

        if (result.success) {
          setTicketData(result.data)
        } else {
          toast.error(result.message || "Failed to fetch ticket data")
        }
      } catch (error) {
        toast.error("Error fetching ticket data")
        console.error(error)
      }
    }

    // Fetch technician list
    const fetchTechnicians = async () => {
      try {
        const response = await fetch("/api/technicianlist")
        const result = await response.json()

        if (Array.isArray(result)) {
          setTechnicians(result)
        } else {
          toast.error("Failed to fetch technicians")
        }
      } catch (error) {
        toast.error("Failed to fetch technicians")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTicketData()
    fetchTechnicians()
  }, [params.id])

  const handleAssignTask = async (technicianId) => {
    const techToAssign = technicianId || selectedTechnician

    if (!techToAssign) {
      toast.error("Please select a technician")
      return
    }

    try {
      const response = await fetch("/api/tasks/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: ticketData?.taskId || ticketData?._id,
          technicianId: techToAssign,
          message: `Assigned to resolve maintenance ticket ${ticketData?.taskId || ticketData?._id}`,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Task assigned successfully")
        // Update the ticket data with the new assignment
        setTicketData(result.data)
      } else {
        toast.error(result.message || "Failed to assign task")
      }
    } catch (error) {
      toast.error("Error assigning task")
      console.error(error)
    }
  }

  const handleMarkAsCompleted = async () => {
    try {
      const response = await fetch(`/api/tasks/${ticketData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          completedAt: new Date(),
          updateMessage: "Task marked as completed",
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Task marked as completed")
        // Update the ticket data with the new status
        setTicketData(result.data)
      } else {
        toast.error(result.message || "Failed to update task status")
      }
    } catch (error) {
      toast.error("Error updating task status")
      console.error(error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!ticketData) {
    return <div className="text-center py-10">No ticket found</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Maintenance Ticket #{ticketData.taskId || ticketData._id}
      </h1>

      <div className="mb-4">
        <label htmlFor="technician-select" className="block text-sm font-medium text-gray-700">
          Assign Technician
        </label>
        <div className="flex items-center space-x-4">
          <select
            id="technician-select"
            value={selectedTechnician || ""}
            onChange={(e) => setSelectedTechnician(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a Technician</option>
            {technicians.map((tech) => (
              <option key={tech._id} value={tech._id} disabled={tech.status !== "Active"}>
                {tech.name} {tech.status !== "Active" ? "(Inactive)" : ""}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleAssignTask()}
            disabled={!selectedTechnician}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign Task
          </button>
        </div>
      </div>

      <ElevatorTicket
        ticket={ticketData}
        technicians={technicians}
        onAssignTechnician={handleAssignTask}
        onMarkCompleted={handleMarkAsCompleted}
      />
    </div>
  )
}

