"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaCalendarAlt, FaFilter, FaSearch, FaUser, FaClock, FaMapMarkerAlt, FaImage, FaClipboardCheck } from 'react-icons/fa';
import Image from 'next/image';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [clockIns, setClockIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    date: '',
  });
  const [selectedClockIn, setSelectedClockIn] = useState(null);

  const fetchClockIns = async () => {
    try {
      setLoading(true);
      
      let url = `/api/clock-in?page=${page}&limit=10`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.date) url += `&date=${filters.date}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch clock-ins');
      }
      
      setClockIns(data.data);
      setTotalPages(data.pagination.pages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchClockIns();
    }
  }, [session, page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const formatDuration = (hours) => {
    if (!hours) return 'Active';
    
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    
    return `${h}h ${m}m`;
  };

  const viewDetails = (clockIn) => {
    setSelectedClockIn(clockIn);
  };

  const closeDetails = () => {
    setSelectedClockIn(null);
  };

  if (loading && clockIns.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <h2 className="text-xl font-semibold">Clock-In Records</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center">
            <FaFilter className="mr-2 text-gray-500" />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clockIns.length > 0 ? (
              clockIns.map((clockIn) => (
                <tr key={clockIn._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-gray-500" />
                      <div className="text-sm font-medium text-gray-900">
                        {clockIn.user?.name || 'Unknown'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(clockIn.clockInTime).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {clockIn.clockOutTime 
                        ? new Date(clockIn.clockOutTime).toLocaleString() 
                        : 'Not clocked out'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDuration(clockIn.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      clockIn.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {clockIn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewDetails(clockIn)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No clock-in records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-l-md border ${
                page === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              Previous
            </button>
            
            <div className="px-4 py-1 border-t border-b">
              Page {page} of {totalPages}
            </div>
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-r-md border ${
                page === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Detail Modal */}
      {selectedClockIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Clock-In Details</h3>
                <button 
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <FaUser className="mr-2 text-blue-500" />
                      <span className="font-medium">Technician:</span>
                    </div>
                    <p>{selectedClockIn.user?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedClockIn.user?.email}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <FaClock className="mr-2 text-blue-500" />
                      <span className="font-medium">Clock In Time:</span>
                    </div>
                    <p>{new Date(selectedClockIn.clockInTime).toLocaleString()}</p>
                  </div>
                  
                  {selectedClockIn.clockOutTime && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <FaClock className="mr-2 text-blue-500" />
                        <span className="font-medium">Clock Out Time:</span>
                      </div>
                      <p>{new Date(selectedClockIn.clockOutTime).toLocaleString()}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <FaClipboardCheck className="mr-2 text-blue-500" />
                      <span className="font-medium">Status:</span>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedClockIn.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedClockIn.status}
                    </span>
                  </div>
                  
                  {selectedClockIn.duration !== null && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <FaClock className="mr-2 text-blue-500" />
                        <span className="font-medium">Duration:</span>
                      </div>
                      <p>{formatDuration(selectedClockIn.duration)}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />
                      <span className="font-medium">Location:</span>
                    </div>
                    <p>
                      Lat: {selectedClockIn.location.latitude}, 
                      Lng: {selectedClockIn.location.longitude}
                    </p>
                    {selectedClockIn.location.address && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedClockIn.location.address}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <FaImage className="mr-2 text-blue-500" />
                      <span className="font-medium">Image:</span>
                    </div>
                    <div className="mt-2 border rounded overflow-hidden">
                      <img 
                        src={selectedClockIn.image || "/placeholder.svg"} 
                        alt="Clock-in verification" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  {selectedClockIn.notes && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <FaClipboardCheck className="mr-2 text-blue-500" />
                        <span className="font-medium">Notes:</span>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {selectedClockIn.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={closeDetails}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
