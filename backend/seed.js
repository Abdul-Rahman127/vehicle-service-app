const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const ServiceCategory = require('./models/ServiceCategory');
const Booking = require('./models/Booking');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await ServiceCategory.deleteMany({});
    await Booking.deleteMany({});
    // Reset counter
    await mongoose.connection.collection('counters').deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('Admin user created (username: admin, password: admin123)');

    // Create service categories
    const services = await ServiceCategory.insertMany([
      {
        name: 'Oil Change',
        description: 'Full synthetic or semi-synthetic oil swap with filter replacement. Keeps your engine running smooth.',
        price: 2500,
        duration: 30,
        icon: 'oil',
        color: '#DC2626',
        isActive: true,
        bookingCount: 86
      },
      {
        name: 'Full Service',
        description: 'Comprehensive inspection, fluid top-ups, filter change, and a 50-point safety check.',
        price: 8000,
        duration: 90,
        icon: 'wrench',
        color: '#DC2626',
        isActive: true,
        bookingCount: 62
      },
      {
        name: 'Brake Inspection',
        description: 'Full brake system check — pads, discs, fluid levels. Safety is our top priority.',
        price: 1500,
        duration: 45,
        icon: 'brake',
        color: '#DC2626',
        isActive: true,
        bookingCount: 31
      },
      {
        name: 'AC Service',
        description: 'Refrigerant refill, filter cleaning, and compressor check to keep you cool all year.',
        price: 3500,
        duration: 40,
        icon: 'ac',
        color: '#DC2626',
        isActive: true,
        bookingCount: 44
      },
      {
        name: 'Battery Check',
        description: 'Load test, terminal cleaning, and charging system inspection. No more surprises.',
        price: 500,
        duration: 20,
        icon: 'battery',
        color: '#DC2626',
        isActive: true,
        bookingCount: 19
      },
      {
        name: 'Engine Diagnostics',
        description: 'OBD-II scan to read fault codes and pinpoint issues fast before they become expensive.',
        price: 1000,
        duration: 35,
        icon: 'engine',
        color: '#DC2626',
        isActive: true,
        bookingCount: 25
      }
    ]);
    console.log('Service categories created');

    // Create sample bookings
    const sampleBookings = [
      { customerName: 'Arun Kumar', phone: '+94 77 111 2233', vehicleNumber: 'WP CAA-1234', vehicleType: 'Car', serviceType: 'Oil Change', date: '27 May', time: '9:00 AM', status: 'Pending', rating: 5 },
      { customerName: 'Suba Rajan', phone: '+94 71 222 3344', vehicleNumber: 'CP BAA-5678', vehicleType: 'Car', serviceType: 'Full Service', date: '27 May', time: '10:00 AM', status: 'Approved', rating: 5 },
      { customerName: 'Priya Menon', phone: '+94 76 333 4455', vehicleNumber: 'NP GAB-9012', vehicleType: 'Car', serviceType: 'AC Service', date: '26 May', time: '11:00 AM', status: 'Completed', rating: 5 },
      { customerName: 'Raj Jayasinghe', phone: '+94 70 444 5566', vehicleNumber: 'WP KBA-3344', vehicleType: 'Car', serviceType: 'Brake Inspection', date: '26 May', time: '1:00 PM', status: 'Rejected' },
      { customerName: 'Nimal Silva', phone: '+94 77 555 6677', vehicleNumber: 'SP AAA-7788', vehicleType: 'Car', serviceType: 'Battery Check', date: '25 May', time: '8:00 AM', status: 'Pending' },
      { customerName: 'Kasun Perera', phone: '+94 72 666 7788', vehicleNumber: 'WP CBC-2211', vehicleType: 'Car', serviceType: 'Engine Diagnostics', date: '25 May', time: '2:00 PM', status: 'Approved' },
      { customerName: 'Dilani Fernando', phone: '+94 75 777 8899', vehicleNumber: 'CP DAA-4455', vehicleType: 'Car', serviceType: 'Tyre Rotation', date: '24 May', time: '3:00 PM', status: 'Completed', rating: 5 },
      { customerName: 'Dinesh Chandimal', phone: '+94 71 700 7788', vehicleNumber: 'CP MBA-8899', vehicleType: 'Car', serviceType: 'Engine Diagnostics', date: '25 May', time: '4:00 PM', status: 'Pending' },
      { customerName: 'Sachini Perera', phone: '+94 75 600 6677', vehicleNumber: 'WP LCA-7788', vehicleType: 'Car', serviceType: 'Tyre Rotation', date: '25 May', time: '3:00 PM', status: 'Pending' },
      { customerName: 'Lasith Malinga', phone: '+94 72 500 5566', vehicleNumber: 'NP KBA-6677', vehicleType: 'Car', serviceType: 'AC Service', date: '26 May', time: '2:00 PM', status: 'Pending' },
      { customerName: 'Kavindi Senanayake', phone: '+94 70 400 4455', vehicleNumber: 'CP JAA-5566', vehicleType: 'Car', serviceType: 'Full Service', date: '26 May', time: '1:00 PM', status: 'Pending' },
      { customerName: 'Sanduni Wijeratne', phone: '+94 999 0011', vehicleNumber: 'NP FCA-8899', vehicleType: 'Car', serviceType: 'Full Service', date: '24 May', time: '10:00 AM', status: 'Completed', rating: 5 }
    ];

    for (const booking of sampleBookings) {
      await Booking.create(booking);
    }
    console.log('Sample bookings created');

    console.log('\n--- Seed Complete ---');
    console.log('Admin Login: username=admin, password=admin123');
    console.log('Services: 6 categories');
    console.log('Bookings: 12 sample bookings');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
