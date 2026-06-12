import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import IMAGES from '../utils/serviceImages';
import SafeImage from '../components/SafeImage';

const HowItWorks = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const steps = [
    {
      num: '01',
      label: 'Step 01',
      title: 'CHOOSE SERVICE',
      desc: 'Enter your name, phone number, vehicle plate number, select vehicle type, and choose which services you need.',
      image: IMAGES.step1,
      tags: ['Name & Phone', 'Vehicle Number', 'Select Services']
    },
    {
      num: '02',
      label: 'Step 02',
      title: 'BOOK APPOINTMENT',
      desc: 'Choose a preferred date and time slot that fits your schedule. We operate morning and afternoon slots every day.',
      image: IMAGES.step2,
      tags: ['Morning Slots: 8am - 12pm', 'Afternoon Slots: 12pm - 6pm', 'Open 7 Days a week']
    },
    {
      num: '03',
      label: 'Step 03',
      title: 'VEHICLE INSPECTION',
      desc: 'Our admin reviews your booking and approves it — usually within the hour. Our technicians inspect your vehicle upon arrival.',
      image: IMAGES.step3,
      tags: ['Reviews in 1 hour', 'Status Update notifications', 'Receipt for records']
    },
    {
      num: '04',
      label: 'Step 04',
      title: 'VEHICLE SERVICING',
      desc: 'Our certified mechanics perform professional servicing using modern equipment. Track your status live until completion.',
      image: IMAGES.step4,
      tags: ['Certified Mechanics Only', 'Live tracking updates', 'Service warranty included']
    },
    {
      num: '05',
      label: 'Step 05',
      title: 'VEHICLE COLLECTION',
      desc: 'Collect your serviced vehicle with confidence. Quality-checked and ready to drive with full service documentation.',
      image: IMAGES.step5,
      tags: ['Quality Check', 'Service Report', 'Warranty Included']
    }
  ];

  const faqs = [
    { q: "DO I NEED TO CREATE AN ACCOUNT?", a: "No account required. Just fill the booking form with your details and you're good to go." },
    { q: "HOW LONG DOES APPROVAL TAKE?", a: "Our admin reviews bookings within 1 hour during working hours. You can view your status update instantly." },
    { q: "CAN I CANCEL OR RESCHEDULE?", a: "Yes — contact us before your slot starts to reschedule at no charge. Same-day cancellations may apply a small fee." },
    { q: "WHAT VEHICLES DO YOU SERVICE?", a: "Cars, SUVs, vans and light trucks. We support all popular brands — Toyota, Honda, Suzuki, Nissan, and Ford." },
    { q: "IS THERE A SERVICE WARRANTY?", a: "Yes! All services come with a 30-day warranty. If the issue returns, we fix it at no extra cost." },
    { q: "HOW DO I TRACK MY BOOKING STATUS?", a: "Use your booking ID on our tracking page to see the status — Pending, Approved, or Completed." }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-neutral-900 text-white py-16 relative overflow-hidden">
        <SafeImage src={IMAGES.howItWorksBanner} alt="How it works" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600 via-neutral-950 to-neutral-950"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Step-by-step</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">HOW IT WORKS</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm sm:text-base">
            The booking process is designed to save your time and get your vehicle serviced without any hassle.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center md:space-x-12 space-y-6 md:space-y-0`}>
                <div className="w-full md:w-72 h-48 rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-gray-200">
                  <SafeImage src={step.image} alt={step.title} className="w-full h-full object-cover object-center" />
                </div>
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-xl flex-shrink-0 shadow-md shadow-red-200 md:hidden">
                  {step.num}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-red-600 text-white items-center justify-center font-extrabold text-xl mb-4 shadow-md shadow-red-200">
                    {step.num}
                  </div>
                  <span className="text-red-600 font-bold text-xs uppercase tracking-widest">{step.label}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-gray-600">
                    {step.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-3 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Got Questions?</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">QUICK ANSWERS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 flex items-start space-x-2 text-sm tracking-wider uppercase">
                  <HelpCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-neutral-900 text-white py-16 text-center border-t border-neutral-800 overflow-hidden">
        <SafeImage src={IMAGES.garage} alt="Get started" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-neutral-900/70"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-extrabold mb-4">READY? LET'S GET STARTED</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">Book your service slots in less than 60 seconds.</p>
          <Link to="/booking" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-bold text-sm tracking-wider uppercase inline-flex items-center space-x-2 transition">
            <span>Book a Service Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
