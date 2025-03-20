export default function ElevatorTicket({ ticket, technicians }) {
    return (
      <div className="flex flex-col md:flex-row gap-5">
        {/* Ticket Details Panel */}
        <div className="flex-grow bg-white rounded-lg shadow-md p-5 flex flex-col">
          {/* Ticket Header */}
          <div className="border-b border-gray-100 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Client Name:</div>
                <div className="font-medium text-sm">{ticket.clientName}</div>
              </div>
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Ticket ID</div>
                <div className="font-medium text-sm">{ticket.ticketId}</div>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Contact</div>
                <div className="font-medium text-sm">{ticket.contact}</div>
              </div>
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Date</div>
                <div className="font-medium text-sm">{ticket.date}</div>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Elevator ID</div>
                <div className="font-medium text-sm">{ticket.elevatorId}</div>
              </div>
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Status</div>
                <div className="font-medium text-sm">{ticket.status}</div>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Location</div>
                <div className="font-medium text-sm">{ticket.location}</div>
              </div>
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Priority</div>
                <div className="font-medium text-sm">{ticket.priority}</div>
              </div>
            </div>
          </div>
  
          {/* Ticket Body */}
          <div className="py-5 flex-grow">
            <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
              <div className="flex items-center">
                <div className="text-gray-500 text-sm w-28">Issue Type:</div>
                <div className="font-medium text-sm">{ticket.issueType}</div>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
                Chat <span>💬</span>
              </button>
            </div>
  
            <div className="mb-5">
              <div className="text-gray-500 text-sm">Description:</div>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">{ticket.description}</p>
            </div>
  
            <div className="mt-5">
              <div className="text-gray-500 text-sm">Uploaded Files</div>
              <div className="flex flex-wrap gap-3 mt-2">
                {ticket.files.map((file, index) => (
                  <img
                    key={index}
                    src={file || "/placeholder.svg"}
                    alt={`Elevator thumbnail ${index + 1}`}
                    className="w-[60px] h-[60px] object-cover rounded border border-gray-200"
                  />
                ))}
              </div>
            </div>
          </div>
  
          {/* Ticket Footer */}
          <div className="flex justify-center pt-5 mt-auto">
            <button className="bg-gray-300 text-white py-3 px-6 rounded text-sm w-full max-w-[200px]">
              Mark as Completed
            </button>
          </div>
        </div>
  
        {/* Technicians Panel */}
        <div className="w-full md:w-[350px] bg-white rounded-lg shadow-md p-5 flex flex-col gap-4">
          {technicians.map((tech, index) => (
            <div className="flex justify-between items-center py-2" key={index}>
              <div className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={`/placeholder.svg?height=50&width=50`}
                    alt={tech.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-sm">{tech.name}</div>
                  <div className="text-xs text-gray-500">{tech.status}</div>
                </div>
              </div>
              <button
                className={`px-4 py-1.5 rounded text-white text-sm ${tech.active ? "bg-green-500" : "bg-gray-300"}`}
              >
                Assign
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  