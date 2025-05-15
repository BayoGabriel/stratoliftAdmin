import Link from "next/link"
import { getProjects } from "@/lib/actions/project-actions"

export const metadata = {
  title: "Projects | Inventory & Project Management",
  description: "Manage your projects",
}

export default async function ProjectsPage() {
  const { data: projects = [] } = await getProjects()

  // Calculate statistics
  const totalProjects = projects.length
  const planningProjects = projects.filter((p) => p.status === "Planning").length
  const inProgressProjects = projects.filter((p) => p.status === "In Progress").length
  const completedProjects = projects.filter((p) => p.status === "Completed").length
  const onHoldProjects = projects.filter((p) => p.status === "On Hold").length

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/create">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Projects</h3>
          <div className="text-2xl font-bold">{totalProjects}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Planning</h3>
          <div className="text-2xl font-bold">{planningProjects}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">In Progress</h3>
          <div className="text-2xl font-bold text-blue-500">{inProgressProjects}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
          <div className="text-2xl font-bold text-green-500">{completedProjects}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">On Hold</h3>
          <div className="text-2xl font-bold text-amber-500">{onHoldProjects}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Projects</h2>
          <button className="flex items-center text-sm border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50">
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>
        </div>
        <div className="p-6">
          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Supplier
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.projectId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.location || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.supplier === "Other" ? project.otherSupplier : project.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.customerContact?.name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : project.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : project.status === "Planning"
                                  ? "bg-gray-100 text-gray-800"
                                  : project.status === "On Hold"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </Link>
                        <Link href={`/projects/${project._id}/edit`} className="text-blue-600 hover:text-blue-900">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No projects found. Click "Add Project" to create your first project.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
