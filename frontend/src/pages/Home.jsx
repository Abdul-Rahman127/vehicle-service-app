import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import SafeImage from '../components/SafeImage';
import IMAGES, { getServiceImage } from '../utils/serviceImages';

const Home = () => {
  const { services, publicStats } = useApp();

  // Filter only active services to display
  const displayServices = services && services.length > 0 
    ? services.filter(s => s.isActive).slice(0, 6)
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-neutral-900 text-white overflow-hidden bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(140,0,0,0.4)), url(${IMAGES.hero})` }}>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-red-600/10 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold text-red-500 tracking-wider uppercase mb-6">
              <Award size={14} />
              <span>DriveX Premium Services</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6">
              DRIVE IN. <br />
              <span className="text-red-600">DRIVE OUT.</span> <br />
              DRIVE BETTER.
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
              DriveX connects you with certified mechanics for fast, reliable vehicle servicing. Book in 60 seconds, track in real-time, get back on the road safely.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link 
                to="/booking" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold text-sm tracking-wider uppercase inline-flex items-center space-x-2 transition shadow-lg shadow-red-600/30"
              >
                <span>Book a Service</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                to="/how-it-works" 
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-md font-bold text-sm tracking-wider uppercase transition"
              >
                See How It Works
              </Link>
            </div>

            {/* Quick stats list */}
            <div className="relative mt-16 pt-8 border-t border-white/10">
              <SafeImage src={IMAGES.statsBg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-xl" />
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left py-4">
              <div>
                <h4 className="text-3xl font-extrabold text-white">{publicStats.totalCompleted || 0}+</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Services Done</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-white">{publicStats.satisfactionPercent || 98}%</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Satisfaction</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-white">{publicStats.serviceCount || 6}+</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Service Types</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-white">24HR</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Turnaround</p>
              </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="relative flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-w-md w-full bg-neutral-800">
              <SafeImage 
                src={IMAGES.heroAlt}
                alt="Expert mechanic working on vehicle" 
                className="w-full h-80 object-cover object-center opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-red-600/90 text-white inline-flex items-center space-x-2 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-3">
                  <span>Now Accepting Bookings</span>
                </div>
                <h3 className="text-lg font-bold text-white">Expert Car Care & Diagnostics</h3>
                <p className="text-xs text-gray-300 mt-1">High-end equipment and certified engineers in Kandy.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Grid Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-600 font-bold uppercase tracking-widest text-xs">What We Offer</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">OUR SERVICES</h2>
            <p className="text-gray-500 mt-4 text-base">
              From routine checks to complex repairs — we handle it all with precision, transparency, and top quality materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service) => (
              <div 
                key={service._id} 
                className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-red-100 transition duration-300 flex flex-col justify-between"
              >
                <div className="h-40 overflow-hidden bg-neutral-900">
                  <SafeImage src={getServiceImage(service.name)} alt={service.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold mb-4 -mt-10 relative z-10 border-4 border-gray-50">
                    <span className="text-lg uppercase">{service.icon?.slice(0, 2) || 'WR'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">Starting Price</span>
                    <span className="text-red-600 font-extrabold text-lg">LKR {service.price?.toLocaleString()}</span>
                  </div>
                  <Link 
                    to={`/booking?service=${encodeURIComponent(service.name)}`}
                    className="text-xs uppercase font-extrabold text-gray-900 hover:text-red-600 tracking-wider flex items-center space-x-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="text-sm font-bold text-red-600 hover:text-red-700 tracking-wider uppercase inline-flex items-center space-x-2"
            >
              <span>View All Services</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-red-600 font-bold uppercase tracking-widest text-xs">DriveX Process</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mt-2 tracking-tight">HOW IT WORKS</h2>
            <p className="text-gray-500 mt-4 text-base">
              Four easy steps to get your vehicle serviced — no phone calls, no waiting in line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                <SafeImage src={IMAGES.step1} alt="Choose Service" className="w-full h-full object-cover object-center" />
              </div>
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-md shadow-red-200">
                01
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">FILL THE FORM</h3>
              <p className="text-gray-500 text-sm px-4">
                Enter your details, vehicle number, and select the service you need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                <SafeImage src={IMAGES.step2} alt="Book Appointment" className="w-full h-full object-cover object-center" />
              </div>
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-md shadow-red-200">
                02
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">CHOOSE A SLOT</h3>
              <p className="text-gray-500 text-sm px-4">
                Pick a preferred date and time slot that fits your busy schedule.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                <SafeImage src={IMAGES.step3} alt="Vehicle Inspection" className="w-full h-full object-cover object-center" />
              </div>
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-md shadow-red-200">
                03
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">WE CONFIRM</h3>
              <p className="text-gray-500 text-sm px-4">
                Our team reviews your booking and approves it within 1 hour.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative text-center">
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                <SafeImage src={IMAGES.step4} alt="Vehicle Collection" className="w-full h-full object-cover object-center" />
              </div>
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-md shadow-red-200">
                04
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">DRIVE IN & DONE</h3>
              <p className="text-gray-500 text-sm px-4">
                Bring your vehicle in. Live tracking keeps you updated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits and Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Benefits / About */}
          <div 
            className="relative rounded-2xl overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(40,0,0,0.8)), url(${IMAGES.aboutInspection})` }}
          >
            <div className="relative p-8">
            <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Why Choose Us</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 mb-8 tracking-tight">
              BUILT FOR VEHICLE OWNERS
            </h2>
            <p className="text-gray-300 mb-8">
              We built DriveX to solve the headaches of traditional vehicle service — no confusing quotes, no constant follow-ups, and complete transparency from start to finish.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-white">TRANSPARENT PRICING</h4>
                  <p className="text-gray-300 text-sm mt-0.5">Know exactly how much you pay upfront. No hidden costs, no surprise extras.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-white">CERTIFIED TECHNICIANS</h4>
                  <p className="text-gray-300 text-sm mt-0.5">Your car is handled by professionals with years of experience and certified training.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-white">REAL-TIME TRACKING</h4>
                  <p className="text-gray-300 text-sm mt-0.5">Follow your booking status in real-time — from Pending, to Approved, to Done.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-white">FAST TURNAROUND</h4>
                  <p className="text-gray-300 text-sm mt-0.5">Efficient processes design to save your time and get your vehicle serviced promptly.</p>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right: Testimonials with image */}
          <div className="relative rounded-2xl overflow-hidden">
            <SafeImage src={IMAGES.aboutCustomer} alt="Customer service" className="absolute inset-0 w-full h-full object-cover opacity-15" />
          <div className="relative bg-gray-50/95 rounded-2xl p-8 border border-gray-100 space-y-6">
            <span className="text-red-600 font-bold uppercase tracking-widest text-xs block">Customer Reviews</span>
            <h3 className="text-2xl font-bold text-gray-900">WHAT THEY SAY</h3>
            
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 text-sm italic mb-4">
                "Booked an oil change, completed within 30 minutes. Extremely convenient! The dashboard interface makes booking effortless."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">AK</div>
                <span className="font-bold text-gray-800 text-sm">Arun Kumar</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 text-sm italic mb-4">
                "Finally a service center that's online! No more calling and waiting. DriveX made everything so simple and transparent."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">SR</div>
                <span className="font-bold text-gray-800 text-sm">Suba Rajan</span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-neutral-900 text-white py-16 border-t border-neutral-800 overflow-hidden">
        <SafeImage src={IMAGES.handover} alt="Customer vehicle handover" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-neutral-900/70"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            READY TO BOOK YOUR SERVICE?
          </h2>
          <p className="text-gray-400 text-base mb-8 max-w-lg mx-auto">
            Takes less than 60 seconds. Select your service, select a date, and let our experts handle the rest.
          </p>
          <Link 
            to="/booking" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold text-sm tracking-wider uppercase inline-flex items-center space-x-2 transition shadow-lg shadow-red-600/30"
          >
            <span>Book a Service Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
