"use client"
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function TechnicianManagement() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTechnicians() {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch technicians");
        }
        const data = await response.json();
        setTechnicians(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTechnicians();
  }, []);

  if (loading) return <div className="text-center p-6">Loading technicians...</div>;
  if (error) return <div className="text-center text-red-500 p-6">{error}</div>;

  const allTechnicians = technicians.map((tech) => ({
    id: tech.id,
    name: tech.name,
    location: tech.location || "Unknown Location",
    status: tech.status || "Inactive",
    image: tech.image || "/placeholder.svg?height=60&width=60",
    lastSeen: tech.lastSeen || null,
  }));

  const techniciansOnDuty = technicians
    .filter((tech) => tech.status === "Active")
    .map((tech) => ({
      id: tech.id,
      name: tech.name,
      status: tech.status,
      image: tech.image || "/placeholder.svg?height=60&width=60",
      action: "Assign",
    }));

  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-screen">
      {/* ALL TECHNICIANS PANEL */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
        <h2 className="text-lg font-bold mb-6">ALL TECHNICIANS</h2>
        <div className="space-y-4">
          {allTechnicians.map((tech) => (
            <div key={tech.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      tech.status === "Active" ? "bg-green-500" : "bg-gray-400"
                    } border-2 border-white`}
                  ></div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{tech.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" size={12} />
                    {tech.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {tech.lastSeen ? (
                  <span className="text-gray-500 text-sm flex items-center justify-end">
                    <FaClock className="mr-1" size={12} />
                    {tech.lastSeen}
                  </span>
                ) : (
                  <span className={`text-sm ${tech.status === "Active" ? "text-green-600" : "text-gray-500"}`}>
                    {tech.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TECHNICIANS ON DUTY PANEL */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:w-96">
        <h2 className="text-lg font-bold mb-6">TECHNICIANS ON DUTY</h2>
        <div className="space-y-4">
          {techniciansOnDuty.map((tech) => (
            <div key={tech.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                      tech.status === "Active" ? "bg-green-500" : "bg-gray-400"
                    } border-2 border-white`}
                  ></div>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-sm">{tech.name}</h3>
                  <p className={`text-xs ${tech.status === "Active" ? "text-green-600" : "text-gray-500"}`}>
                    {tech.status}
                  </p>
                </div>
              </div>
              <button
                className={`px-4 py-1.5 rounded text-sm font-medium ${
                  tech.action === "Assign" ? "bg-green-500 text-white" : "bg-green-100 text-green-600"
                }`}
              >
                {tech.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
