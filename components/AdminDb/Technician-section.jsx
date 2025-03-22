"use client"
import { useEffect, useState } from "react";

export default function TechniciansSection() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch("/api/users", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch users");
  
        const data = await response.json();
        setTechnicians(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTechnicians();
  }, []);
  

  if (loading) return <p>Loading technicians...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Technicians</h2>
      {technicians.length === 0 ? (
        <p className="text-gray-500">No technicians found.</p>
      ) : (
        <div className="space-y-3">
          {technicians.map((tech) => (
            <div key={tech._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 mr-3">
                  <img
                    src={tech.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={tech.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{tech.name}</div>
                  <div className="text-xs text-gray-500">{tech.status || "Active"}</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600">
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
