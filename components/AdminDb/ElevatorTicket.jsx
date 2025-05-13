"use client"

import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import messages from "@/public/messages.svg"
import Image from "next/image"
import engineer from "@/public/engineer.png"

export default function ElevatorTicket({ ticket, technicians, onAssignTechnician, onMarkCompleted }) {

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  const getCreatorName = () => {
    if (ticket.createdBy && ticket.createdBy.name) {
      return ticket.createdBy.name
    }
    return "Unknown"
  }

  const getAssignedTechName = () => {
    if (ticket.assignedTo && ticket.assignedTo.name) {
      return ticket.assignedTo.name
    }
    return "Not assigned"
  }

  const formatPriority = (priority) => {
    if (!priority) return "N/A"
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 w-full">
      {/* Ticket Details Panel */}
      <div className="flex flex-col gap-8 w-fit">
        {/* Ticket Header */}
        <div className="border-b bg-white flex-grow rounded-lg shadow-md p-10 border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Client Name:</div>
              <div className="font-[700] text-[16px] inter uppercase">{getCreatorName()}</div>
            </div>
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Ticket ID:</div>
              <div className="font-[700] text-[16px] inter">{ticket.taskId || ticket._id}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Contact:</div>
              <div className="font-[700] text-[16px] inter">{ticket.createdBy?.email || "N/A"}</div>
            </div>
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Created:</div>
              <div className="font-[700] text-[16px] inter">{formatDate(ticket.createdAt)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Assigned To:</div>
              <div className="font-[700] text-[16px] inter">{getAssignedTechName()}</div>
            </div>
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Status:</div>
              <div className="font-[700] text-[16px] inter capitalize">{ticket.status || "N/A"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Location:</div>
              <div className="font-[700] text-[16px] inter">{ticket.location || "N/A"}</div>
            </div>
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Priority:</div>
              <div className="font-[700] text-[16px] inter">{formatPriority(ticket.priority)}</div>
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="border-b bg-white flex-grow rounded-lg shadow-md p-10 w-full border-gray-100">
          <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
            <div className="flex items-center">
              <div className="text-[#888888] text-[16px] font-[700] inter w-28">Issue Type:</div>
              <div className="font-[700] text-[16px] inter capitalize">{ticket.type || "N/A"}</div>
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 text-[14px]">
              <span>Chat</span> <Image src={messages} alt="messages"/>
            </button>
          </div>

          {/* <div className="mb-5">
            <div className="text-[#888888] text-[16px] font-[700] inter">Title:</div>
            <p className="text-sm font-medium mt-2">{ticket.title || "N/A"}</p>
          </div> */}

          <div className="mb-5">
            <div className="text-[#888888] text-[16px] font-[700] inter">Description:</div>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              {ticket.description || "No description provided"}
            </p>
          </div>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mt-5">
              <div className="text-[#888888] text-[16px] font-[700] inter">Uploaded Files</div>
              <div className="flex flex-wrap gap-3 mt-2">
                {ticket.attachments.map((file, index) => (
                  <Link key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="block">
                    {file.type && file.type.startsWith("image/") ? (
                      <Image
                        src={file.url || "/placeholder.svg?height=60&width=60"}
                        alt={file.name || `Attachment ${index + 1}`}
                        className="w-[60px] h-[60px] object-cover rounded border border-gray-200"
                      />
                    ) : (
                      <div className="w-[60px] h-[60px] flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-xs text-center p-1">
                        {file.name || `File ${index + 1}`}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {ticket.updates && ticket.updates.length > 0 && (
            <div className="mt-5">
              <div className="text-[#888888] text-[16px] font-[700] inter mb-2">Updates:</div>
              <div className="space-y-3">
                {ticket.updates.map((update, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{update.updatedBy?.firstName || "Unknown"}</span>
                      <span className="text-gray-500 text-xs">{formatDate(update.timestamp || update.updatedAt)}</span>
                    </div>
                    <p>{update.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ticket Footer */}
        <div className="flex justify-end pt-5 mt-auto">
          <button
            className={`py-3 px-6 rounded text-[14px] w-full inter font-[700] max-w-[200px] ${
              ticket.status === "completed"
                ? "bg-[#C4C4C4] text-white cursor-not-allowed"
                : "bg-[#EC3237] hover:bg-[#ec32388e] text-white"
            }`}
            onClick={onMarkCompleted}
            disabled={ticket.status === "completed"}
          >
            {ticket.status === "completed" ? "MArked as Completed" : "Mark as Completed"}
          </button>
        </div>
      </div>

      {/* Technicians Panel */}
      <div className="w-full md:w-[350px] bg-white rounded-lg shadow-md p-5 flex flex-col gap-4">
        {/* <h3 className="font-medium text-gray-700 mb-2">Available Technicians</h3> */}
        {technicians.length === 0 ? (
          <p className="text-sm text-gray-500">No technicians available</p>
        ) : (
          technicians.map((tech) => (
            <div className="flex justify-between items-center py-2" key={tech._id}>
              <div className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    <Image
                      src={tech.image || engineer }
                      alt={tech.name || "Technician"}
                      className="w-full h-full object-cover"
                    />
                </div>
                <div>
                  <div className="font-[700] text-[16px] inter">
                    <span>{tech.firstName} </span>
                    <span>{tech.lastName} </span>
                  </div>
                  <div className="text-xs text-gray-500">{tech.status}</div>
                </div>
              </div>
              <button
                onClick={() => onAssignTechnician(tech._id)}
                disabled={tech.status !== "Active" || (ticket.assignedTo && ticket.assignedTo._id === tech._id)}
                className={`px-4 py-1.5 rounded text-white text-sm ${
                  tech.status === "Active" && (!ticket.assignedTo || ticket.assignedTo._id !== tech._id)
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {ticket.assignedTo && ticket.assignedTo._id === tech._id ? "Assigned" : "Assign"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

