import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit2, Wrench, Check, RotateCcw } from 'lucide-react';

const AdminServices = () => {
  const { services, addService, editService, removeService } = useApp();

  // Add/Edit Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(30);
  const [icon, setIcon] = useState('wrench');
  const [color, setColor] = useState('#DC2626');

  // Mini stats
  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const inactiveServices = totalServices - activeServices;

  // Icon set options
  const iconsList = ['wrench', 'oil', 'brake', 'ac', 'battery', 'engine', 'car', 'document', 'search', 'settings'];
  // Color set options
  const colorsList = ['#DC2626', '#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#111827'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceData = {
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      icon,
      color
    };

    if (isEditing) {
      await editService(editingId, serviceData);
      setIsEditing(false);
      setEditingId(null);
    } else {
      await addService(serviceData);
    }

    // Reset Form
    setName('');
    setDescription('');
    setPrice(0);
    setDuration(30);
    setIcon('wrench');
    setColor('#DC2626');
  };

  const handleEdit = (service) => {
    setIsEditing(true);
    setEditingId(service._id);
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
    setDuration(service.duration);
    setIcon(service.icon || 'wrench');
    setColor(service.color || '#DC2626');
  };

  const handleToggleActive = (id, currentVal) => {
    editService(id, { isActive: !currentVal });
  };

  return (
    <AdminLayout>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">SERVICE CATEGORIES</h1>
        <p className="text-gray-400 text-xs">Add, edit, and manage vehicle service types.</p>
      </div>

      {/* Mini Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
          <span className="text-xl">🛠️</span>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Categories</span>
            <span className="text-2xl font-black text-gray-800 block mt-0.5">{totalServices}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
          <span className="text-xl text-green-600">✓</span>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Active</span>
            <span className="text-2xl font-black text-green-600 block mt-0.5">{activeServices}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
          <span className="text-xl text-gray-400">✗</span>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Inactive</span>
            <span className="text-2xl font-black text-gray-400 block mt-0.5">{inactiveServices}</span>
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-900 text-base mb-2 uppercase tracking-wider">All Categories</h3>
          
          {services.map((service) => (
            <div 
              key={service._id} 
              className={`bg-white rounded-xl border p-5 shadow-sm transition duration-200 flex items-center justify-between ${!service.isActive ? 'opacity-60 border-dashed border-gray-200' : 'border-gray-200 hover:border-red-100'}`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white uppercase flex-shrink-0" style={{ backgroundColor: service.color || '#DC2626' }}>
                  {service.icon?.slice(0, 2) || 'WR'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{service.name}</h4>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 max-w-md">{service.description}</p>
                  
                  <div className="flex space-x-4 text-xs font-semibold text-gray-600 mt-2">
                    <span className="text-red-600">LKR {service.price?.toLocaleString()}</span>
                    <span>•</span>
                    <span>{service.duration} mins</span>
                    <span>•</span>
                    <span className="text-gray-400">{service.bookingCount || 0} bookings</span>
                  </div>
                </div>
              </div>

              {/* Actions & Toggle */}
              <div className="flex items-center space-x-4">
                {/* Switch Toggle */}
                <button 
                  onClick={() => handleToggleActive(service._id, service.isActive)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${service.isActive ? 'bg-red-600' : 'bg-gray-200'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${service.isActive ? 'transform translate-x-5' : ''}`}></div>
                </button>

                <button 
                  onClick={() => handleEdit(service)}
                  className="text-gray-400 hover:text-red-600 p-1.5 transition rounded-full hover:bg-gray-50"
                  title="Edit details"
                >
                  <Edit2 size={16} />
                </button>

                <button 
                  onClick={() => removeService(service._id)}
                  className="text-gray-400 hover:text-red-600 p-1.5 transition rounded-full hover:bg-gray-50"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Form (1 col) */}
        <div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 text-base mb-4 uppercase tracking-wider">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  placeholder="e.g. Wheel Alignment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea 
                  rows="3" 
                  required 
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  placeholder="Describe what the service includes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Starting Price (LKR)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration (Mins)</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pick Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconsList.map((ic) => (
                    <button 
                      key={ic} 
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`px-2.5 py-1.5 border rounded text-xs uppercase font-bold transition ${icon === ic ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Card Color</label>
                <div className="flex items-center space-x-3">
                  {colorsList.map((col) => (
                    <button 
                      key={col} 
                      type="button"
                      onClick={() => setColor(col)}
                      className={`w-6 h-6 rounded-full border transition-transform ${color === col ? 'scale-125 ring-2 ring-red-500' : ''}`}
                      style={{ backgroundColor: col }}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition"
                >
                  {isEditing ? 'Save Changes' : 'Add Category'}
                </button>
                {isEditing && (
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingId(null);
                      setName('');
                      setDescription('');
                      setPrice(0);
                      setDuration(30);
                      setIcon('wrench');
                      setColor('#DC2626');
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3.5 py-2.5 rounded text-xs uppercase tracking-wider transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminServices;
