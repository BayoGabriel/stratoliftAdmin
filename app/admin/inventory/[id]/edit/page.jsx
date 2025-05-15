"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getInventoryById, updateInventory } from "@/lib/actions/inventory-actions"
import Link from "next/link"

export default function EditInventoryPage({ params }) {
  const router = useRouter()
  const [inventory, setInventory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchInventory() {
      try {
        const result = await getInventoryById(params.id)
        if (result.success) {
          setInventory(result.data)
        } else {
          setError(result.error || "Failed to fetch inventory item.")
          router.push("/inventory")
        }
      } catch (error) {
        console.error("Error fetching inventory:", error)
        setError("An unexpected error occurred.")
        router.push("/inventory")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [params.id, router])

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const formData = new FormData(event.target)
      const result = await updateInventory(params.id, formData)

      if (result.success) {
        router.push(`/inventory/${params.id}`)
      } else {
        setError(result.error || "Failed to update inventory item.")
      }
    } catch (error) {
      console.error("Error updating inventory:", error)
      setError("An unexpected error occurred.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Loading inventory details...</p>
        </div>
      </div>
    )
  }

  if (!inventory) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p>Inventory item not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href={`/inventory/${params.id}`}>
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
            Back to Inventory Item
          </button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Edit Inventory Item</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Edit Inventory Details</h2>
          <p className="text-sm text-gray-500">Update the details for {inventory.name}.</p>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue={inventory.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                  Project
                </label>
                <input
                  id="project"
                  name="project"
                  defaultValue={inventory.project?._id}
                  placeholder="Project ID (optional)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  defaultValue={inventory.quantity}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dateSupplied" className="block text-sm font-medium text-gray-700">
                  Date Supplied
                </label>
                <input
                  id="dateSupplied"
                  name="dateSupplied"
                  type="date"
                  defaultValue={
                    inventory.dateSupplied ? new Date(inventory.dateSupplied).toISOString().split("T")[0] : ""
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <input
                  id="assignedTo"
                  name="assignedTo"
                  defaultValue={inventory.assignedTo?._id || ""}
                  placeholder="User ID (optional)"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  id="category"
                  name="category"
                  defaultValue={inventory.category || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Storage Location
                </label>
                <input
                  id="location"
                  name="location"
                  defaultValue={inventory.location || ""}
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
                  defaultValue={inventory.status}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Available">Available</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={inventory.description || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/inventory/${params.id}`}>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
