"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export default function TicketManagement() {
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
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tasks`);
        const result = await response.json();
        
        if (result.success) {
          // Filter tickets based on active tab
          const filteredByTab = result.data.filter(ticket => 
            activeTab === 'active'
              ? ['pending', 'assigned', 'in-progress', 'unresolved'].includes(ticket.status)
              : ['completed', 'resolved'].includes(ticket.status)
          );
          
          setTickets(filteredByTab);
          setFilteredTickets(filteredByTab);
        } else {
          toast.error(result.message || 'Failed to fetch tickets');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Error loading tickets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTickets();
    // Reset filters when tab changes
    resetFilters();
  }, [activeTab]);
  
  // Apply filters when they change
  useEffect(() => {
    if (!tickets.length) return;
    
    const filtered = tickets.filter(ticket => {
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
  }, [tickets, statusFilter, dateFilter, priorityFilter, assignedFilter]);
  
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
  
  // Count active and completed tickets (based on current fetch)
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
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="min-w-full bg-gray-50 border-collapse table-fixed">
            <thead>
              <tr className="text-left text-gray-500 text-sm uppercase">
                <th className="w-12 px-4 py-3 font-medium">No</th>
                <th className="w-32 px-4 py-3 font-medium">Client</th>
                <th className="w-24 px-4 py-3 font-medium">Ticket ID</th>
                <th className="w-24 px-4 py-3 font-medium">Location</th>
                <th className="w-24 px-4 py-3 font-medium">Status</th>
                <th className="w-24 px-4 py-3 font-medium">Assigned</th>
                <th className="w-24 px-4 py-3 font-medium">Date</th>
                <th className="w-24 px-4 py-3 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, index) => (
                  <Link 
                    href={`/admin/service-ticket/${ticket._id}`} 
                    key={ticket._id}
                    className="contents"  // This allows the link to not interfere with table styling
                  >
                    <tr className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-4 text-sm text-center">{index + 1}</td>
                      <td className="px-4 py-4 text-sm">
                        {ticket.createdBy?.name || 'Unknown Client'}
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
                    No tickets found matching the current filters
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