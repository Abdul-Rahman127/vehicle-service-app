import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Send, Check, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import IMAGES from '../utils/serviceImages';
import SafeImage from '../components/SafeImage';
import * as api from '../api';

const Contact = () => {
  const { publicSettings } = useApp();
  const business = publicSettings?.businessInfo || {
    name: 'DriveX Vehicle Services',
    address: 'Peradeniya Road',
    city: 'Kandy',
    country: 'Sri Lanka',
    phone: '+94 77 123 4567',
    email: 'info@drivex.lk'
  };
  const workingHours = publicSettings?.workingHours || [
    { day: 'Monday', open: '8:00 AM', close: '6:00 PM', closed: false },
    { day: 'Tuesday', open: '8:00 AM', close: '6:00 PM', closed: false },
    { day: 'Wednesday', open: '8:00 AM', close: '6:00 PM', closed: false },
    { day: 'Thursday', open: '8:00 AM', close: '6:00 PM', closed: false },
    { day: 'Friday', open: '8:00 AM', close: '6:00 PM', closed: false },
    { day: 'Saturday', open: '8:00 AM', close: '4:00 PM', closed: false },
    { day: 'Sunday', open: 'Closed', close: 'Closed', closed: true }
  ];

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', subject: 'General Inquiry', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.submitContact(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
      }, 3000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const mapDirectionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Kandy,+Sri+Lanka';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-neutral-900 text-white py-16 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(80,0,0,0.5)), url(${IMAGES.contactBanner})` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">We're Here To Help</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">GET IN TOUCH WITH US</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Have a question about a service? Want to reschedule? We're always ready to help.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            <div className="space-y-8">
              <div>
                <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Reach Us</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-2">CONTACT INFO</h3>
                <p className="text-gray-500 text-sm">Multiple ways to reach us — pick what's easiest for you.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">PHONE</h5>
                    <a href={`tel:${business.phone}`} className="text-gray-800 text-sm mt-1 block hover:text-red-600">{business.phone}</a>
                    <p className="text-gray-400 text-xs mt-0.5">Mon — Sat, 8 AM to 6 PM</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">EMAIL</h5>
                    <a href={`mailto:${business.email}`} className="text-gray-800 text-sm mt-1 block hover:text-red-600">{business.email}</a>
                    <p className="text-gray-400 text-xs mt-0.5">We reply within 3 hours</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="h-28 overflow-hidden bg-neutral-900">
                    <SafeImage src={IMAGES.contactLocation} alt="DriveX service center in Kandy" className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="p-5 flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">LOCATION</h5>
                    <p className="text-gray-800 text-sm mt-1">{business.address}</p>
                    <p className="text-gray-800 text-sm">{business.city}, {business.country}</p>
                    <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 text-xs font-bold mt-2 inline-flex items-center space-x-1 hover:underline">
                      <ExternalLink size={12} />
                      <span>Get Directions</span>
                    </a>
                  </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider flex items-center space-x-2">
                  <Clock size={16} className="text-red-600" />
                  <span>WORKING HOURS</span>
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {workingHours.map((wh) => (
                    <div key={wh.day} className="flex justify-between py-1.5 border-b border-gray-100">
                      <span>{wh.day}</span>
                      {wh.closed ? (
                        <span className="font-bold text-red-600">Closed</span>
                      ) : (
                        <span className="font-semibold text-gray-900">{wh.open} — {wh.close}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-red-100">
                <SafeImage src={IMAGES.contactSupport} alt="Customer support" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="relative bg-red-50/95 p-5">
                <h5 className="font-bold text-gray-900 text-sm mb-1">SUPPORT CONTACT</h5>
                <p className="text-gray-600 text-xs">For urgent booking assistance, call us directly or email {business.email}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">SEND A MESSAGE</h3>
                <p className="text-gray-500 text-sm mb-6">Fill in your details and we'll get back to you as soon as possible.</p>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Check size={24} />
                    </div>
                    <h4 className="font-bold">Message Sent Successfully!</h4>
                    <p className="text-sm">Thank you for reaching out. We will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded text-xs font-semibold">{submitError}</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                        <input type="text" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" placeholder="Your full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                        <input type="tel" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" placeholder="+94 XX XXX XXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                      <input type="email" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                      <select className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Booking Assistance">Booking Assistance / Reschedule</option>
                        <option value="Feedback">Complaints & Feedback</option>
                        <option value="Business Partners">Business Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Message</label>
                      <textarea rows="5" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" placeholder="Tell us how we can help you..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase px-8 py-3 rounded inline-flex items-center justify-center space-x-2 transition">
                      <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                      <Send size={14} />
                    </button>
                  </form>
                )}
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                  <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wider">Our Location — Kandy, Sri Lanka</h3>
                  <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 text-xs font-bold uppercase inline-flex items-center space-x-1 hover:underline flex-shrink-0">
                    <ExternalLink size={14} />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-[420px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202429.3511373087!2d80.5714!3d7.2906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae366889418ece9%3A0x9b2fce6d1b83ca03!2sKandy%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="DriveX Location - Kandy, Sri Lanka"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-red-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <h4 className="font-bold text-lg">READY TO BOOK A SERVICE?</h4>
            <p className="text-red-100 text-xs">Skip the contact form — book your slot directly in 60 seconds.</p>
          </div>
          <Link to="/booking" className="bg-white text-red-600 font-bold px-6 py-2.5 rounded text-sm hover:bg-neutral-100 transition shadow">
            BOOK NOW &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
