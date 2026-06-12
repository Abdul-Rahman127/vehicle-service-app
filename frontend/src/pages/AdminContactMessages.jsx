import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import * as api from '../api';
import { Mail, Search, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';

const AdminContactMessages = () => {
  const { setUnreadMessageCount } = useApp();
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const filters = { page, limit: 15 };
      if (search) filters.search = search;
      if (statusFilter !== 'all') filters.status = statusFilter;

      const data = await api.getContactMessages(filters);
      setMessages(data.messages || []);
      setTotal(data.total || 0);

      const unread = await api.getContactMessages({ status: 'unread', limit: 1 });
      setUnreadMessageCount(unread.total || 0);
    } catch (error) {
      console.error('Failed to load messages:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadMessages();
  };

  const setReadStatus = async (msg, isRead) => {
    try {
      await api.updateContactReadStatus(msg._id, isRead);
      loadMessages();
    } catch (error) {
      console.error('Failed to update status:', error.message);
    }
  };

  const toggleRead = async (msg) => {
    await setReadStatus(msg, !msg.isRead);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact message permanently?')) return;
    try {
      await api.deleteContactMessage(id);
      if (selectedMessage?._id === id) setSelectedMessage(null);
      loadMessages();
    } catch (error) {
      console.error('Failed to delete:', error.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-LK', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(total / 15) || 1;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">CONTACT MESSAGES</h1>
          <p className="text-gray-400 text-xs">View and manage all customer contact form submissions.</p>
        </div>
        <button onClick={loadMessages} className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-600 inline-flex items-center space-x-1">
          <RefreshCw size={14} /><span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search name, email, phone, subject..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:border-red-500 focus:outline-none" />
          </div>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider">Search</button>
        </form>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none">
          <option value="all">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
              <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-12 text-gray-400 text-xs font-bold uppercase">Loading messages...</td></tr>
                ) : messages.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-gray-400 text-xs font-bold uppercase">No contact messages found.</td></tr>
                ) : messages.map((msg) => (
                  <tr key={msg._id} className={`hover:bg-gray-50/50 cursor-pointer ${!msg.isRead ? 'bg-red-50/30' : ''} ${selectedMessage?._id === msg._id ? 'bg-red-50' : ''}`}
                    onClick={() => { setSelectedMessage(msg); if (!msg.isRead) setReadStatus(msg, true); }}>
                    <td className="px-4 py-3">
                      {!msg.isRead ? (
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">New</span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">Read</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{msg.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{msg.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{msg.phone}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-red-600">{msg.subject}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(msg.createdAt)}</td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center space-x-1">
                        <button onClick={() => toggleRead(msg)} title={msg.isRead ? 'Mark unread' : 'Mark read'}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100">
                          {msg.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => handleDelete(msg._id)} title="Delete"
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-400 font-semibold">{total} total messages</span>
              <div className="flex space-x-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-40 font-bold">Prev</button>
                <span className="px-2 py-1 font-bold text-gray-600">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-40 font-bold">Next</button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Mail size={16} className="text-red-600" /><span>Message Detail</span>
          </h3>
          {selectedMessage ? (
            <div className="space-y-4 text-sm">
              <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Name</span><p className="font-bold text-gray-900">{selectedMessage.name}</p></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Email</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-red-600 hover:underline">{selectedMessage.email}</a></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Phone</span>
                <a href={`tel:${selectedMessage.phone}`} className="text-gray-800">{selectedMessage.phone}</a></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Subject</span><p className="font-semibold text-gray-800">{selectedMessage.subject}</p></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Received</span><p className="text-gray-600">{formatDate(selectedMessage.createdAt)}</p></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase block">Message</span>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">{selectedMessage.message}</p></div>
            </div>
          ) : (
            <p className="text-gray-400 text-xs font-semibold uppercase text-center py-8">Select a message to view details</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContactMessages;
