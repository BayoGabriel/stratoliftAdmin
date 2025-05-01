"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useSession } from "next-auth/react" // Import useSession
import ElevatorTicket from "@/components/AdminDb/ElevatorTicket"
import { toast } from "sonner"
import TaskAssignedModal from "@/components/shared/TaskAssignedModal"

export default function TicketPage({ params }) {
  // Unwrap the params Promise
  const unwrappedParams = use(params)
  const ticketId = unwrappedParams.id
  
  const { data: session } = useSession() // Get current session with accessToken
  const [ticketData, setTicketData] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTechnician, setSelectedTechnician] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [assignedTechnician, setAssignedTechnician] = useState(null)

  useEffect(() => {
    // Only proceed if we have an access token
    if (!session?.accessToken) return

    // Fetch ticket data
    const fetchTicketData = async () => {
      try {
        const response = await fetch(`/api/tasks/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}` // Include authorization header
          }
        })
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
        const response = await fetch("/api/technicianlist", {
          headers: {
            Authorization: `Bearer ${session.accessToken}` // Include authorization header
          }
        })
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
  }, [ticketId, session])

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
          "Authorization": `Bearer ${session.accessToken}` // Include authorization header
        },
        body: JSON.stringify({
          taskId: ticketData?.taskId || ticketData?._id,
          technicianId: techToAssign,
          message: `Assigned to resolve maintenance ticket ${ticketData?.taskId || ticketData?._id}`,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Find the assigned technician's details to display in the modal
        const technicianDetails = technicians.find(tech => tech._id === techToAssign)
        setAssignedTechnician(technicianDetails)
        
        // Show the modal instead of toast
        setIsModalOpen(true)
        
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
          "Authorization": `Bearer ${session.accessToken}` // Include authorization header
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

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Show loading state while waiting for session or data
  if (!session) {
    return (
      <div className="max-w-7xl mx-auto p-5">
        <div className="text-center py-10">Loading session...</div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!ticketData) {
    return <div className="text-center py-10">No ticket found</div>
  }

  return (
    <div className="max-w-7xl mx-auto p-5">
      <ElevatorTicket
        ticket={ticketData}
        technicians={technicians}
        onAssignTechnician={handleAssignTask}
        onMarkCompleted={handleMarkAsCompleted}
        onSelectTechnician={setSelectedTechnician}
        selectedTechnician={selectedTechnician}
      />
      
      <TaskAssignedModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        technician={assignedTechnician}
      />
    </div>
  )
}