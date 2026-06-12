import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { CheckCircle, ShieldCheck, Clock, Calendar, Car } from 'lucide-react';

const Booking = () => {
  const { services, addBooking } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('9:00 AM');
  const [notes, setNotes] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill service from query params
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setServiceType(serviceParam);
    } else if (services && services.length > 0) {
      setServiceType(services[0].name);
    }
  }, [searchParams, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const bookingData = {
      customerName,
      phone,
      vehicleNumber,
      vehicleType,
      serviceType,
      date,
      time,
      notes
    };

    try {
      const res = await addBooking(bookingData);
      setSuccessBooking(res);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Split Layout Section */}
      <section className="py-16 bg-gray-50 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {successBooking ? (
            /* Booking Confirmation Screen */
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-red-600 text-white p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} />
                </div>
                <h2 className="text-3xl font-extrabold">BOOKING CONFIRMED</h2>
                <p className="text-red-100 text-sm mt-1">We are ready to service your vehicle</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="border-b border-gray-100 pb-4 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Booking ID</span>
                  <span className="text-3xl font-black text-gray-900 tracking-wider">{successBooking.bookingId || 'BK013'}</span>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-gray-400 block font-semibold text-xs uppercase">Customer Name</span>
                    <span className="font-bold text-gray-800">{successBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold text-xs uppercase">Phone Number</span>
                    <span className="font-bold text-gray-800">{successBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold text-xs uppercase">Vehicle Number</span>
                    <span className="font-bold text-gray-800">{successBooking.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold text-xs uppercase">Vehicle Type</span>
                    <span className="font-bold text-gray-800">{successBooking.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold text-xs uppercase">Service Type</span>
                    <span className="font-bold text-red-600">{successBooking.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-semibold text-xs uppercase">Date & Time</span>
                    <span className="font-bold text-gray-800">{successBooking.date} at {successBooking.time}</span>
                  </div>
                </div>

                {successBooking.notes && (
                  <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
                    <span className="block font-bold text-xs uppercase text-gray-400 mb-1">Customer Notes</span>
                    {successBooking.notes}
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                      setSuccessBooking(null);
                      setCustomerName('');
                      setPhone('');
                      setVehicleNumber('');
                      setNotes('');
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded text-sm uppercase tracking-wider transition"
                  >
                    Book Another Service
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded text-sm uppercase tracking-wider transition"
                  >
                    Go Back Home
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Entry Form Screen */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Side: Copy/Text */}
              <div>
                <span className="text-red-600 font-bold uppercase tracking-widest text-xs">BOOK NOW</span>
                <div className="inline-flex items-center space-x-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  <span>Now Accepting Bookings</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
                  YOUR CAR <br />
                  DESERVES <br />
                  <span className="text-red-600">EXPERT CARE</span>
                </h1>
                
                <p className="text-gray-500 text-base mb-8 max-w-md leading-relaxed">
                  Schedule your vehicle service in under 2 minutes. Trusted mechanics, transparent pricing, real-time status updates, zero hassle.
                </p>

                {/* Benefits lists */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600 pt-6 border-t border-gray-200">
                  <div>
                    <span className="text-2xl font-black text-gray-900 block">4800+</span>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Services Done</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-gray-900 block">98%</span>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Satisfaction Rate</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-gray-900 block">12+</span>
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Service Types</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-red-600 text-white p-6">
                  <h3 className="font-extrabold text-xl uppercase tracking-wide">Book A Service</h3>
                  <p className="text-red-100 text-xs mt-0.5">Fill in your details below to schedule your appointment</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-sm font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none" 
                        placeholder="Arun Kumar"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                      <input 
                        type="tel" 
                        required 
                        className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none" 
                        placeholder="+94 77 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle Number</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none" 
                        placeholder="WP CAA-1234"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle Type</label>
                      <select 
                        className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                      >
                        <option value="Car">Car</option>
                        <option value="SUV">SUV</option>
                        <option value="Van">Van / Lorry</option>
                        <option value="Motorbike">Motorbike</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Type</label>
                    <select 
                      required
                      className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      {services.filter(s => s.isActive).map(s => (
                        <option key={s._id} value={s.name}>{s.name} (LKR {s.price})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preferred Date</label>
                      <input 
                        type="date" 
                        required 
                        className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preferred Time</label>
                      <select 
                        className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      >
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Additional Notes (Optional)</label>
                    <textarea 
                      rows="3" 
                      className="w-full border border-gray-200 rounded px-3.5 py-2 text-sm focus:border-red-500 focus:outline-none" 
                      placeholder="e.g. Engine diagnostics light is on, brake screeching sound..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3.5 rounded text-sm uppercase tracking-wider transition shadow-lg shadow-red-600/30"
                  >
                    {loading ? 'Submitting booking...' : 'Confirm Booking'}
                  </button>

                  <p className="text-center text-xs text-gray-400 pt-2">
                    Your information is fully secured. By booking you agree to our policies.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust banners */}
      <section className="bg-neutral-900 border-t border-neutral-800 text-gray-400 py-6 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center sm:justify-between items-center gap-4">
          <span className="flex items-center space-x-1.5"><ShieldCheck className="text-red-500" size={18} /><span>Same-Day Appointments</span></span>
          <span className="flex items-center space-x-1.5"><ShieldCheck className="text-red-500" size={18} /><span>Certified Technicians</span></span>
          <span className="flex items-center space-x-1.5"><ShieldCheck className="text-red-500" size={18} /><span>Real-Time Status Updates</span></span>
          <span className="flex items-center space-x-1.5"><ShieldCheck className="text-red-500" size={18} /><span>Service Guarantee</span></span>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
