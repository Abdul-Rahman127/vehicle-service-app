import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? 'text-red-600 border-b-2 border-red-600 font-semibold'
      : 'text-gray-600 hover:text-red-600 transition';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-extrabold tracking-tighter text-red-600 font-serif">DRIVEX</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className={`py-2 text-sm tracking-wide uppercase ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/services" className={`py-2 text-sm tracking-wide uppercase ${isActive('/services')}`}>
              Services
            </Link>
            <Link to="/how-it-works" className={`py-2 text-sm tracking-wide uppercase ${isActive('/how-it-works')}`}>
              How It Works
            </Link>
            <Link to="/contact" className={`py-2 text-sm tracking-wide uppercase ${isActive('/contact')}`}>
              Contact
            </Link>
          </div>

          {/* Book Now Button (Desktop) & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              to="/booking"
              className="hidden md:block bg-red-600 text-white px-6 py-3 rounded-md text-sm font-semibold tracking-wider hover:bg-red-700 transition uppercase shadow-md shadow-red-200"
            >
              Book Now
            </Link>
            
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-red-600 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col shadow-inner">
          <Link 
            to="/" 
            className={`block px-3 py-3 rounded-md text-base tracking-wide uppercase ${isActive('/')}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className={`block px-3 py-3 rounded-md text-base tracking-wide uppercase ${isActive('/services')}`}
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link 
            to="/how-it-works" 
            className={`block px-3 py-3 rounded-md text-base tracking-wide uppercase ${isActive('/how-it-works')}`}
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </Link>
          <Link 
            to="/contact" 
            className={`block px-3 py-3 rounded-md text-base tracking-wide uppercase ${isActive('/contact')}`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/booking"
            className="block w-full text-center mt-4 bg-red-600 text-white px-6 py-3 rounded-md text-base font-semibold tracking-wider hover:bg-red-700 transition uppercase shadow-md shadow-red-200"
            onClick={() => setIsOpen(false)}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
