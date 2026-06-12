import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import { Search, FileSpreadsheet, Trash2, CheckCircle, XCircle, Play } from 'lucide-react';

const AdminBookings = () => {
  const { bookings, updateStatus, removeBooking, services } = useApp();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.bookingId && b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesService = 
      serviceFilter === 'All' || b.serviceType === serviceFilter;

    const matchesStatus = 
      statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  // Pagination calculation
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  // Stats summaries
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;
  const rejected = bookings.filter(b => b.status === 'Rejected').length;

  const handleExportCSV = () => {
    // Generate simple mock CSV
    let csvContent = "data:text/csv;charset=utf-8,ID,Customer,Phone,Vehicle,Service,Date,Time,Status\n";
    filteredBookings.forEach((b) => {
      csvContent += `${b.bookingId || 'N/A'},"${b.customerName}","${b.phone}","${b.vehicleNumber}","${b.serviceType}","${b.date}","${b.time}","${b.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `drivex_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ALL BOOKINGS</h1>
          <p className="text-gray-400 text-xs">Manage and update all customer service bookings.</p>
        </div>
      </div>

      {/* Top mini-stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Bookings</span>
          <span className="text-2xl font-black text-gray-800 block mt-1">{total}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Pending Bookings</span>
          <span className="text-2xl font-black text-amber-600 block mt-1">{pending}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Completed Bookings</span>
          <span className="text-2xl font-black text-green-600 block mt-1">{completed}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Rejected Bookings</span>
          <span className="text-2xl font-black text-red-600 block mt-1">{rejected}</span>
        </div>
      </div>

      {/* Filtering Options Grid */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search by customer name, ID, vehicle..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-sm focus:border-red-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none bg-white text-gray-600 font-semibold"
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Services</option>
            {services.map(s => (
              <option key={s._id} value={s.name}>{s.name}</option>
            ))}
          </select>

          <select 
            className="border border-gray-200 rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none bg-white text-gray-600 font-semibold"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button 
            onClick={handleExportCSV}
            className="bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded inline-flex items-center space-x-1.5 transition shadow shadow-red-200"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-400 font-bold uppercase tracking-wider text-xs">
                    No bookings matched your selection criteria.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-gray-400">{b.bookingId || 'BK013'}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{b.customerName}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">{b.phone}</td>
                    <td className="px-6 py-4 text-xs">
                      <span className="font-bold text-gray-800 block">{b.vehicleNumber}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{b.vehicleType}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-red-600 uppercase">{b.serviceType}</td>
                    <td className="px-6 py-4 text-xs">{b.date}</td>
                    <td className="px-6 py-4 text-xs">{b.time}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wide ${getStatusStyle(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        {b.status === 'Pending' && (
                          <button 
                            onClick={() => updateStatus(b._id, 'Approved')}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-blue-200 transition"
                            title="Approve Booking"
                          >
                            Approve
                          </button>
                        )}
                        {(b.status === 'Approved' || b.status === 'Pending') && (
                          <button 
                            onClick={() => updateStatus(b._id, 'Completed')}
                            className="bg-green-50 text-green-600 hover:bg-green-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-green-200 transition"
                            title="Mark Completed"
                          >
                            Done
                          </button>
                        )}
                        {b.status === 'Pending' && (
                          <button 
                            onClick={() => updateStatus(b._id, 'Rejected')}
                            className="bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-200 transition"
                            title="Reject Booking"
                          >
                            Reject
                          </button>
                        )}
                        <button 
                          onClick={() => removeBooking(b._id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition"
                          title="Delete booking"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm text-xs font-semibold text-gray-500">
          <span>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} bookings</span>
          <div className="flex space-x-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded font-bold transition flex items-center justify-center ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;
