import ElevatorTicket from "@/components/AdminDb/ElevatorTicket"

export default function TicketPage({ params }) {
  // In a real app, you would fetch the ticket data using the ID from params.id
  // For this example, we'll use hardcoded data

  const ticketData = {
    clientName: "XYZ PLAZA",
    ticketId: "#12343",
    contact: "08051273361",
    date: "05 Feb 25",
    elevatorId: "#DS00821",
    status: "Pending",
    location: "Gado nasco road, NNPC Kubwa",
    priority: "Normal",
    issueType: "Overheating Issues",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    files: [
      "/placeholder.svg?height=50&width=50",
      "/placeholder.svg?height=50&width=50",
      "/placeholder.svg?height=50&width=50",
    ],
  }

  const technicians = [
    { name: "Christian M.", status: "Inactive", active: false },
    { name: "James Adamu", status: "Active", active: true },
    { name: "James Adamu", status: "Active", active: true },
    { name: "Christian M.", status: "Inactive", active: false },
    { name: "James Adamu", status: "Active", active: true },
    { name: "Christian M.", status: "Inactive", active: false },
    { name: "James Adamu", status: "Active", active: true },
  ]

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Elevator Maintenance Ticket #{params.id}</h1>
      <ElevatorTicket ticket={ticketData} technicians={technicians} />
    </div>
  )
}

