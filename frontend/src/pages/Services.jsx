// eslint-disable-next-line no-unused-vars
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import IMAGES, { getServiceImage } from '../utils/serviceImages';
import SafeImage from '../components/SafeImage';

const Services = () => {
  const { services, loading } = useApp();

  const activeServices = services ? services.filter(s => s.isActive) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Services Header */}
      <section className="bg-neutral-900 text-white py-16 relative overflow-hidden">
        <SafeImage src={IMAGES.servicesBanner} alt="Our services" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600 via-neutral-950 to-neutral-950"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Premium Care</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">OUR SERVICES</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Click on any service category to book. DriveX provides comprehensive maintenance solutions for all vehicle makes and models.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20 w-full col-span-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : activeServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeServices.map((service) => (
                <div 
                  key={service._id} 
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-200 transition duration-300 flex flex-col justify-between"
                >
                  <div className="h-48 bg-neutral-900 relative overflow-hidden">
                    <SafeImage 
                      src={getServiceImage(service.name)}
                      alt={service.name} 
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(20,0,0,0.7))' }}></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="bg-red-600/90 text-white font-bold text-xs uppercase px-2.5 py-1 rounded">
                        {service.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center space-x-1.5 text-gray-500">
                          <Clock size={16} />
                          <span>Duration: {service.duration} mins</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-red-600 font-bold">
                          <Tag size={16} />
                          <span>LKR {service.price?.toLocaleString()}</span>
                        </div>
                      </div>

                      <Link 
                        to={`/booking?service=${encodeURIComponent(service.name)}`}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-center py-2.5 rounded font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center space-x-2 transition"
                      >
                        <span>Book Service</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
                <Tag size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Services Available</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We are currently updating our service catalog. Please check back later or contact us for more information.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
