export default function TechniciansSection() {
    const technicians = [
      { name: "Christian M.", status: "Inactive" },
      { name: "Christian M.", status: "Inactive" },
      { name: "Christian M.", status: "Inactive" },
      { name: "Christian M.", status: "Inactive" },
      { name: "Christian M.", status: "Inactive" },
    ]
  
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Technicians</h2>
        <div className="space-y-3">
          {technicians.map((tech, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 mr-3">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt={tech.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{tech.name}</div>
                  <div className="text-xs text-gray-500">{tech.status}</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  