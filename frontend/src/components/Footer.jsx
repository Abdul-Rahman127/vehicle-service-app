import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';
import IMAGES from '../utils/serviceImages';

const Footer = () => {
  return (
    <footer className="relative bg-neutral-950 text-gray-400 pt-16 pb-8 border-t border-neutral-900 overflow-hidden">
      <SafeImage
        src={IMAGES.footerBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-neutral-950/80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <span className="text-3xl font-extrabold tracking-tighter text-white font-serif">DRIVEX</span>
            <p className="mt-4 text-sm text-neutral-400 max-w-sm leading-relaxed">
              Premium vehicle servicing in Kandy, Sri Lanka. Certified technicians, transparent pricing, and professional automotive care you can trust.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/booking" className="hover:text-white transition">Book Now</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Legal & Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><span className="text-neutral-500">Kandy, Sri Lanka</span></li>
              <li><a href="mailto:info@drivex.lk" className="hover:text-white transition">info@drivex.lk</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
          <p>© 2026 DriveX Vehicle Services. Professional Automotive Care.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>SECURE PAYMENTS</span>
            <span>ESTD 2024</span>
            <Link to="/login" className="hover:text-neutral-300 underline">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
