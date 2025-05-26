// app/admin/service-ticket/page.jsx
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react'; // for accessToken

export default function SOSTicketManagement() {
  // Tab state
  const [activeTab, setActiveTab] = useState('active');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  
  // Data states
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Status options based on active tab
  const statusOptions = activeTab === 'active' 
    ? ['', 'pending', 'assigned', 'in-progress', 'unresolved'] 
    : ['', 'completed', 'resolved'];
  
  // Fetch tickets from API
    const { data: session } = useSession(); // get session
  
    useEffect(() => {
      async function fetchTickets() {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/tasks?type=service`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });
          const result = await response.json();
  
          if (result.success) {
            // Filter by tab status
            const filteredByTab = result.data.filter(ticket =>
              activeTab === 'active'
                ? ['pending', 'assigned', 'in-progress', 'unresolved'].includes(ticket.status)
                : ['completed', 'resolved'].includes(ticket.status)
            );
  
            setTickets(result.data);
            setFilteredTickets(filteredByTab);
          } else {
            toast.error(result.message || 'Failed to fetch service tickets');
          }
        } catch (error) {
          console.error('Error fetching tickets:', error);
          toast.error('Error loading tickets. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
  
      if (session?.accessToken) {
        fetchTickets();
        resetFilters(); // Reset filters on tab change
      }
    }, [session?.accessToken, activeTab]);
  
  // Apply filters when they change
  useEffect(() => {
    if (!tickets.length) return;
    
    const filtered = tickets.filter(ticket => {
      // First, filter by active/completed tab
      const isTabMatch = activeTab === 'active'
        ? ['pending', 'assigned', 'in-progress', 'unresolved'].includes(ticket.status)
        : ['completed', 'resolved'].includes(ticket.status);
      
      if (!isTabMatch) return false;
      
      // Apply status filter
      if (statusFilter && ticket.status !== statusFilter) return false;
      
      // Apply priority filter
      if (priorityFilter && ticket.priority !== priorityFilter) return false;
      
      // Apply assigned filter
      if (assignedFilter === 'Yes' && !ticket.assignedTo) return false;
      if (assignedFilter === 'No' && ticket.assignedTo) return false;
      
      // Apply date filter
      if (dateFilter && format(parseISO(ticket.createdAt), 'dd MMM yy') !== dateFilter) return false;
      
      return true;
    });
    
    setFilteredTickets(filtered);
  }, [tickets, statusFilter, dateFilter, priorityFilter, assignedFilter, activeTab]);
  
  // Reset filters
  const resetFilters = () => {
    setStatusFilter('');
    setDateFilter('');
    setPriorityFilter('');
    setAssignedFilter('');
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetFilters();
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd MMM yy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get unique dates for filter
  const getUniqueDates = () => {
    const dates = tickets.map(ticket => formatDate(ticket.createdAt));
    return ['', ...new Set(dates)];
  };
  
  // Count active and completed SOS tickets
  const activeCount = tickets.filter(ticket => 
    ['pending', 'assigned', 'in-progress', 'unresolved'].includes(ticket.status)
  ).length;
  const completedCount = tickets.filter(ticket => 
    ['completed', 'resolved'].includes(ticket.status)
  ).length;
  
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
          Active <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{activeCount}</span>
        </button>
        <button
          onClick={() => handleTabChange('completed')}
          className={`pb-2 px-4 font-medium text-sm ${
            activeTab === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{completedCount}</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 my-4">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white w-[120px]"
          disabled={isLoading}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Status'}
            </option>
          ))}
        </select>
        
        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white w-[120px]"
          disabled={isLoading}
        >
          {getUniqueDates().map(date => (
            <option key={date} value={date}>
              {date || 'Date'}
            </option>
          ))}
        </select>
        
        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white w-[120px]"
          disabled={isLoading}
        >
          <option value="">Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        
        {/* Assigned Filter */}
        <select
          value={assignedFilter}
          onChange={(e) => setAssignedFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white w-[120px]"
          disabled={isLoading}
        >
          <option value="">Assigned</option>
          <option value="Yes">Assigned</option>
          <option value="No">Unassigned</option>
        </select>
        
        {/* Reset Filters */}
        {(statusFilter || dateFilter || priorityFilter || assignedFilter) && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto mt-4">
        {isLoading ? (
          <table className="min-w-full bg-[#F2F2F2] border-collapse table-fixed">
          <thead>
              <tr className="text-left text-[#565656] text-sm uppercase">
              <th className="w-12 px-4 py-3 font-[600]">No</th>
              <th className="w-32 px-4 py-3 font-[600]">Client</th>
              <th className="w-24 px-4 py-3 font-[600]">Ticket ID</th>
              <th className="w-24 px-4 py-3 font-[600]">Location</th>
              <th className="w-24 px-4 py-3 font-[600]">Status</th>
              <th className="w-24 px-4 py-3 font-[600]">Assigned</th>
              <th className="w-24 px-4 py-3 font-[600]">Date</th>
              <th className="w-24 px-4 py-3 font-[600]">Priority</th>
              </tr>
          </thead>
          <tbody>
              {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse border-b-[2px] border-b-[#C4C4C4]">
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
                  <td className="px-4 py-4 bg-gray-200 rounded-md"></td>
              </tr>
              ))}
          </tbody>
          </table>
        ) : (
          <table className="min-w-full bg-[#F2F2F2] border-collapse table-fixed">
            <thead>
              <tr className="text-left text-[#565656] text-sm uppercase">
                <th className="w-12 px-4 py-3 font-[600]">No</th>
                <th className="w-32 px-4 py-3 font-[600]">Client</th>
                <th className="w-24 px-4 py-3 font-[600]">Ticket ID</th>
                <th className="w-24 px-4 py-3 font-[600]">Location</th>
                <th className="w-24 px-4 py-3 font-[600]">Status</th>
                <th className="w-24 px-4 py-3 font-[600]">Assigned</th>
                <th className="w-24 px-4 py-3 font-[600]">Date</th>
                <th className="w-24 px-4 py-3 font-[600]">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-[2px] divide-[#C4C4C4]">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, index) => (
                  <Link 
                    href={`/admin/service-ticket/${ticket._id}`} 
                    key={ticket._id}
                    className="contents"
                  >
                    <tr className="hover:bg-gray-50 border-b-[2px] border-b-[#C4C4C4] inter text-[16px] font-[400] cursor-pointer">
                      <td className="px-4 py-4 text-sm text-center">{index + 1}</td>
                      <td className="px-4 py-4 text-sm">
                      {ticket.createdBy?.firstName}
                        {' '}
                        {ticket.createdBy?.lastName}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {ticket.taskId || `#${ticket._id.substring(0, 6)}`}
                      </td>
                      <td className="px-4 py-4 text-sm">{ticket.location || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm capitalize">{ticket.status}</td>
                      <td className="px-4 py-4 text-sm text-center">
                        {ticket.assignedTo ? 'Yes' : 'No'}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className={`px-4 py-4 text-sm capitalize ${
                        ticket.priority === 'urgent' || ticket.priority === 'high' 
                          ? 'text-red-500' 
                          : ''
                      }`}>
                        {ticket.priority}
                      </td>
                    </tr>
                  </Link>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-sm text-center text-gray-500">
                    No SOS tickets found matching the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}