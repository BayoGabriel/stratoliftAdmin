"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProject } from "@/lib/actions/project-actions"
import Link from "next/link"

export default function CreateProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [supplier, setSupplier] = useState("Pumalift")
  const [numberOfStops, setNumberOfStops] = useState(2)
  const [activeTab, setActiveTab] = useState("basic")

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData(event.target)

      // Add stops data to formData
      const stops = []
      for (let i = 0; i < numberOfStops; i++) {
        const height = formData.get(`stop-${i}-height`)
        const description = formData.get(`stop-${i}-description`)

        if (height) {
          stops.push({
            floorNumber: i,
            height: Number(height),
            description: description || `Floor ${i}`,
          })
        }
      }

      formData.append("stops", JSON.stringify(stops))

      const result = await createProject(formData)

      if (result.success) {
        router.push("/projects")
      } else {
        setError(result.error || "Failed to create project.")
      }
    } catch (error) {
      console.error("Error creating project:", error)
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/projects">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Create Project</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "basic"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("technical")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "technical"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Technical Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("financial")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "financial"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Financial
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("customer")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "customer"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Customer
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "basic" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <p className="text-sm text-gray-500">Enter the basic details for your new project.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                    Reference
                  </label>
                  <input
                    id="reference"
                    name="reference"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue="Planning"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700">
                    Expected Completion Date
                  </label>
                  <input
                    id="completionDate"
                    name="completionDate"
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="assignedUsers" className="block text-sm font-medium text-gray-700">
                  Assigned Users
                </label>
                <input
                  id="assignedUsers"
                  name="assignedUsers"
                  placeholder="Enter user IDs separated by commas"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="text-xs text-gray-500">
                  Enter the IDs of users assigned to this project, separated by commas
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "technical" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Technical Details</h2>
              <p className="text-sm text-gray-500">Enter the technical specifications for this project.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="numberOfStops" className="block text-sm font-medium text-gray-700">
                    Number of Stops
                  </label>
                  <input
                    id="numberOfStops"
                    name="numberOfStops"
                    type="number"
                    min="1"
                    value={numberOfStops}
                    onChange={(e) => setNumberOfStops(Number.parseInt(e.target.value) || 1)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                    Supplier
                  </label>
                  <select
                    id="supplier"
                    name="supplier"
                    defaultValue="Pumalift"
                    onChange={(e) => setSupplier(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Pumalift">Pumalift</option>
                    <option value="MP">MP</option>
                    <option value="Canny">Canny</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {supplier === "Other" && (
                  <div className="space-y-2">
                    <label htmlFor="otherSupplier" className="block text-sm font-medium text-gray-700">
                      Other Supplier
                    </label>
                    <input
                      id="otherSupplier"
                      name="otherSupplier"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="shaftWidth" className="block text-sm font-medium text-gray-700">
                    Shaft Width (mm)
                  </label>
                  <input
                    id="shaftWidth"
                    name="shaftWidth"
                    type="number"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="shaftDepth" className="block text-sm font-medium text-gray-700">
                    Shaft Depth (mm)
                  </label>
                  <input
                    id="shaftDepth"
                    name="shaftDepth"
                    type="number"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="pitDepth" className="block text-sm font-medium text-gray-700">
                    Pit Depth (mm)
                  </label>
                  <input
                    id="pitDepth"
                    name="pitDepth"
                    type="number"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="font-medium">Stop Heights</h3>
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: numberOfStops }).map((_, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                      <div className="space-y-2">
                        <label htmlFor={`stop-${index}-height`} className="block text-sm font-medium text-gray-700">
                          Floor {index} Height (mm)
                        </label>
                        <input
                          id={`stop-${index}-height`}
                          name={`stop-${index}-height`}
                          type="number"
                          min="0"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`stop-${index}-description`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Floor {index} Description
                        </label>
                        <input
                          id={`stop-${index}-description`}
                          name={`stop-${index}-description`}
                          placeholder={`Floor ${index}`}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "financial" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Financial Details</h2>
              <p className="text-sm text-gray-500">Enter the financial information for this project.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="costOfPurchase" className="block text-sm font-medium text-gray-700">
                    Cost of Purchase
                  </label>
                  <input
                    id="costOfPurchase"
                    name="costOfPurchase"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="costOfInstallation" className="block text-sm font-medium text-gray-700">
                    Cost of Installation
                  </label>
                  <input
                    id="costOfInstallation"
                    name="costOfInstallation"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="customerCharge" className="block text-sm font-medium text-gray-700">
                    Customer Charge
                  </label>
                  <input
                    id="customerCharge"
                    name="customerCharge"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="financialNotes" className="block text-sm font-medium text-gray-700">
                  Financial Notes
                </label>
                <textarea
                  id="financialNotes"
                  name="financialNotes"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "customer" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Customer Information</h2>
              <p className="text-sm text-gray-500">Enter the customer details for this project.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="customerContact.name" className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    id="customerContact.name"
                    name="customerContact.name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="customerContact.email" className="block text-sm font-medium text-gray-700">
                    Customer Email
                  </label>
                  <input
                    id="customerContact.email"
                    name="customerContact.email"
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="customerContact.phone" className="block text-sm font-medium text-gray-700">
                    Customer Phone
                  </label>
                  <input
                    id="customerContact.phone"
                    name="customerContact.phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="customerContact.address" className="block text-sm font-medium text-gray-700">
                    Customer Address
                  </label>
                  <input
                    id="customerContact.address"
                    name="customerContact.address"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="customerNotes" className="block text-sm font-medium text-gray-700">
                  Customer Notes
                </label>
                <textarea
                  id="customerNotes"
                  name="customerNotes"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 space-x-4">
          <Link href="/projects">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  )
}
