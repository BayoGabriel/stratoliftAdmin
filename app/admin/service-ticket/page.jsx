"use client"
import { useState, useEffect } from 'react';
import { FaChevronDown } from "react-icons/fa";

export default function TicketManagement() {
  // Tab state
  const [activeTab, setActiveTab] = useState('active');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [urgencyFilter, setUrgencyFilter] = useState(null);
  const [assignedFilter, setAssignedFilter] = useState(null);
  
  // Sample data
  const activeTickets = [
    { id: 1, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Pending', assigned: true, date: '02 Feb 25', priority: 'Emergency' },
    { id: 2, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Processing', assigned: true, date: '02 Feb 25', priority: 'Normal' },
    { id: 3, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Pending', assigned: true, date: '02 Feb 25', priority: 'Emergency' },
    { id: 4, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Processing', assigned: true, date: '02 Feb 25', priority: 'Normal' },
    { id: 5, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Processing', assigned: true, date: '02 Feb 25', priority: 'Normal' },
    { id: 6, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Pending', assigned: true, date: '02 Feb 25', priority: 'Emergency' },
    { id: 7, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Processing', assigned: true, date: '02 Feb 25', priority: 'Normal' },
    { id: 8, client: 'XYZ Plaza & Co', ticketId: '#12343', location: 'Kubwa', status: 'Pending', assigned: true, date: '02 Feb 25', priority: 'Emergency' },
    { id: 9, client: 'ABC Corp', ticketId: '#12344', location: 'Lagos', status: 'Pending', assigned: true, date: '03 Feb 25', priority: 'Normal' },
    { id: 10, client: 'DEF Industries', ticketId: '#12345', location: 'Abuja', status: 'Processing', assigned: false, date: '04 Feb 25', priority: 'Emergency' },
  ];
  
  const completedTickets = [
    { id: 11, client: 'XYZ Plaza & Co', ticketId: '#12340', location: 'Kubwa', status: 'Completed', assigned: true, date: '01 Feb 25', priority: 'Normal' },
    { id: 12, client: 'ABC Corp', ticketId: '#12341', location: 'Lagos', status: 'Completed', assigned: true, date: '01 Feb 25', priority: 'Emergency' },
    { id: 13, client: 'DEF Industries', ticketId: '#12342', location: 'Abuja', status: 'Completed', assigned: true, date: '01 Feb 25', priority: 'Normal' },
    { id: 14, client: 'GHI Services', ticketId: '#12346', location: 'Port Harcourt', status: 'Completed', assigned: true, date: '31 Jan 25', priority: 'Emergency' },
    { id: 15, client: 'JKL Enterprises', ticketId: '#12347', location: 'Kano', status: 'Completed', assigned: true, date: '31 Jan 25', priority: 'Normal' },
    { id: 16, client: 'MNO Limited', ticketId: '#12348', location: 'Enugu', status: 'Completed', assigned: true, date: '30 Jan 25', priority: 'Emergency' },
    { id: 17, client: 'PQR Holdings', ticketId: '#12349', location: 'Ibadan', status: 'Completed', assigned: true, date: '30 Jan 25', priority: 'Normal' },
    { id: 18, client: 'STU Group', ticketId: '#12350', location: 'Benin', status: 'Completed', assigned: true, date: '29 Jan 25', priority: 'Emergency' },
    { id: 19, client: 'VWX Solutions', ticketId: '#12351', location: 'Kaduna', status: 'Completed', assigned: true, date: '29 Jan 25', priority: 'Normal' },
    { id: 20, client: 'YZA Consultants', ticketId: '#12352', location: 'Calabar', status: 'Completed', assigned: true, date: '28 Jan 25', priority: 'Emergency' },
    { id: 21, client: 'BCD Technologies', ticketId: '#12353', location: 'Warri', status: 'Completed', assigned: true, date: '28 Jan 25', priority: 'Normal' },
    { id: 22, client: 'EFG Systems', ticketId: '#12354', location: 'Owerri', status: 'Completed', assigned: true, date: '27 Jan 25', priority: 'Emergency' },
    { id: 23, client: 'HIJ Networks', ticketId: '#12355', location: 'Uyo', status: 'Completed', assigned: true, date: '27 Jan 25', priority: 'Normal' },
  ];
  
  // Filtered tickets
  const [filteredTickets, setFilteredTickets] = useState(activeTickets);
  
  // Apply filters when they change
  useEffect(() => {
    const currentTickets = activeTab === 'active' ? activeTickets : completedTickets;
    
    const filtered = currentTickets.filter(ticket => {
      // Apply status filter
      if (statusFilter && ticket.status !== statusFilter) return false;
      
      // Apply urgency filter
      if (urgencyFilter && ticket.priority !== urgencyFilter) return false;
      
      // Apply assigned filter
      if (assignedFilter === 'Yes' && !ticket.assigned) return false;
      if (assignedFilter === 'No' && ticket.assigned) return false;
      
      // Apply date filter (simplified for demo)
      if (dateFilter && ticket.date !== dateFilter) return false;
      
      return true;
    });
    
    setFilteredTickets(filtered);
  }, [activeTab, statusFilter, dateFilter, urgencyFilter, assignedFilter]);
  
  // Reset filters
  const resetFilters = () => {
    setStatusFilter(null);
    setDateFilter(null);
    setUrgencyFilter(null);
    setAssignedFilter(null);
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetFilters();
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleTabChange('active')}
          className={`pb-2 px-4 font-medium text-sm ${
            activeTab === 'active'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{activeTickets.length}</span>
        </button>
        <button
          onClick={() => handleTabChange('completed')}
          className={`pb-2 px-4 font-medium text-sm ${
            activeTab === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{completedTickets.length}</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 my-4">
        {/* Status Filter */}
        <div className="relative">
          <button
            className="flex items-center justify-between w-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
            onClick={() => {
              const options = activeTab === 'active' 
                ? ['Pending', 'Processing'] 
                : ['Completed'];
              setStatusFilter(options[0]);
            }}
          >
            <span>{statusFilter || 'Status'}</span>
            <FaChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Date Filter */}
        <div className="relative">
          <button
            className="flex items-center justify-between w-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
            onClick={() => {
              setDateFilter(activeTab === 'active' ? '02 Feb 25' : '01 Feb 25');
            }}
          >
            <span>{dateFilter || 'Date'}</span>
            <FaChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Urgency Filter */}
        <div className="relative">
          <button
            className="flex items-center justify-between w-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
            onClick={() => {
              setUrgencyFilter(urgencyFilter === 'Emergency' ? 'Normal' : 'Emergency');
            }}
          >
            <span>{urgencyFilter || 'Urgency'}</span>
            <FaChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Assigned Filter */}
        <div className="relative">
          <button
            className="flex items-center justify-between w-[100px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
            onClick={() => {
              setAssignedFilter(assignedFilter === 'Yes' ? 'No' : 'Yes');
            }}
          >
            <span>{assignedFilter || 'Assigned'}</span>
            <FaChevronDown className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Reset Filters */}
        {(statusFilter || dateFilter || urgencyFilter || assignedFilter) && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-gray-50 border-collapse">
          <thead>
            <tr className="text-left text-gray-500 text-sm uppercase">
              <th className="px-4 py-3 font-medium">No</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Ticket ID</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assigned</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Priority</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, index) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{index + 1}</td>
                  <td className="px-4 py-4 text-sm">{ticket.client}</td>
                  <td className="px-4 py-4 text-sm">{ticket.ticketId}</td>
                  <td className="px-4 py-4 text-sm">{ticket.location}</td>
                  <td className="px-4 py-4 text-sm">{ticket.status}</td>
                  <td className="px-4 py-4 text-sm">{ticket.assigned ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 text-sm">{ticket.date}</td>
                  <td className={`px-4 py-4 text-sm ${ticket.priority === 'Emergency' ? 'text-red-500' : ''}`}>
                    {ticket.priority}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-sm text-center text-gray-500">
                  No tickets found matching the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
