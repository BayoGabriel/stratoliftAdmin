export default function ElevatorDashboard() {
  // Sample data for the table
  const elevatorData = Array(8).fill({
    no: 1,
    client: "XYZ Plaza & Co",
    elevatorId: "#12343",
    location: "Kubwa",
    date: "02 Feb 25",
  })

  return (
    <div className="w-full">
      {/* Filter dropdowns */}
      <div className="flex gap-2 mb-4">
        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 bg-white text-gray-700 cursor-pointer focus:outline-none">
            <option>ELEVATOR ID</option>
            <option>#12343</option>
            <option>#12344</option>
            <option>#12345</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded-md px-4 py-2 pr-8 bg-white text-gray-700 cursor-pointer focus:outline-none">
            <option>Location</option>
            <option>Kubwa</option>
            <option>Abuja</option>
            <option>Lagos</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-600">NO</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">CLIENT</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">ELEVATOR ID</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">LOCATION</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">DATE</th>
              <th className="py-3 px-4 text-left font-medium text-gray-600">DECISION</th>
            </tr>
          </thead>
          <tbody>
            {elevatorData.map((data, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-3 px-4">{data.no}</td>
                <td className="py-3 px-4">{data.client}</td>
                <td className="py-3 px-4">{data.elevatorId}</td>
                <td className="py-3 px-4">{data.location}</td>
                <td className="py-3 px-4">{data.date}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-md hover:bg-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

