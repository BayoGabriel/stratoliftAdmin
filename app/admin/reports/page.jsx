"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState({ roles: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) throw new Error("Failed to fetch reports");

        const data = await response.json();
        setReports(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading reports...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reports Overview</h2>

      {/* User Roles Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">User Roles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reports.roles.length === 0 ? (
            <p className="text-gray-500">No user roles found.</p>
          ) : (
            reports.roles.map((role) => (
              <div key={role._id} className="bg-blue-100 p-4 rounded-lg">
                <p className="text-lg font-bold text-gray-700">{role._id}</p>
                <p className="text-sm text-gray-600">Count: {role.count}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Types Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Task Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reports.tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : (
            reports.tasks.map((task) => (
              <div key={task._id} className="bg-green-100 p-4 rounded-lg">
                <p className="text-lg font-bold text-gray-700">{task._id}</p>
                <p className="text-sm text-gray-600">Count: {task.count}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
