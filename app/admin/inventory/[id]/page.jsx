import Link from "next/link"
import { notFound } from "next/navigation"
import { getInventoryById } from "@/lib/actions/inventory-actions"
import InventoryActions from "@/components/inventory-actions"

export async function generateMetadata({ params }) {
  const { data: inventory } = await getInventoryById(params.id)

  if (!inventory) {
    return {
      title: "Inventory Not Found",
    }
  }

  return {
    title: `${inventory.name} | Inventory`,
    description: `Details for inventory item ${inventory.name}`,
  }
}

export default async function InventoryDetailPage({ params }) {
  const { data: inventory } = await getInventoryById(params.id)

  if (!inventory) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/admin/inventory">
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
            Back to Inventory
          </button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{inventory.name}</h1>
            <p className="text-gray-500">{inventory.inventoryId}</p>
          </div>
        </div>

        <div className="flex mt-4 md:mt-0 space-x-4">
          <Link href={`/admin/inventory/${inventory._id}/edit`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </Link>
          <InventoryActions inventoryId={inventory._id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              inventory.status === "Available"
                ? "bg-green-100 text-green-800"
                : inventory.status === "Low Stock"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {inventory.status}
          </span>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Quantity</h3>
          <div className="text-2xl font-bold">{inventory.quantity}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Date Supplied</h3>
          <div className="text-lg">{new Date(inventory.dateSupplied).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Details</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Project</dt>
                <dd className="mt-1">
                  {inventory.project ? (
                    <Link href={`/projects/${inventory.project._id}`} className="text-blue-600 hover:underline">
                      {inventory.project.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1">{inventory.category || "—"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1">{inventory.location || "—"}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                <dd className="mt-1">
                  {inventory.assignedTo ? `${inventory.assignedTo.firstName} ${inventory.assignedTo.lastName}` : "—"}
                </dd>
              </div>
            </dl>

            {inventory.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-sm">{inventory.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Usage History</h2>
            <p className="text-sm text-gray-500">Record of inventory usage</p>
          </div>
          <div className="p-6">
            {inventory.usedBy && inventory.usedBy.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.usedBy.map((usage, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usage.user ? `${usage.user.firstName} ${usage.user.lastName}` : "Unknown User"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(usage.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usage.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">No usage history found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
