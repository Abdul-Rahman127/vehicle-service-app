const dns = require('dns');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Append public DNS servers so mongodb+srv SRV lookups work when system DNS refuses them
const systemDns = dns.getServers();
if (systemDns.length) {
  dns.setServers([...systemDns, '8.8.8.8', '1.1.1.1']);
} else {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const Settings = require('../models/Settings');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB Connection Failed: MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
    console.log(`Connection Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

    // Seed default admin account if it does not exist
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'DriveX',
        email: 'admin@drivex.lk',
        phone: '+94 77 123 4567',
        role: 'Super Administrator'
      });
      console.log("Default admin account seeded successfully (admin / admin123)");
    }

    // Seed default service categories if they don't exist
    const categoryCount = await ServiceCategory.countDocuments();
    if (categoryCount === 0) {
      await ServiceCategory.insertMany([
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
      console.log("Default service categories seeded successfully");
    }

    const settingsExist = await Settings.findOne({ key: 'app' });
    if (!settingsExist) {
      await Settings.create({
        key: 'app',
        businessInfo: {
          name: 'DriveX Vehicle Services',
          address: 'Peradeniya Road',
          city: 'Kandy',
          country: 'Sri Lanka',
          phone: '+94 77 123 4567',
          email: 'info@drivex.lk',
          website: 'www.drivex.lk',
          description: 'Professional vehicle servicing in Kandy, Sri Lanka.'
        }
      });
      console.log('Default business settings seeded successfully');
    }

  } catch (error) {
    console.error('MongoDB Connection Failed');
    console.error(`Error: ${error.message}`);
    if (error.code) console.error(`Code: ${error.code}`);
    if (error.reason) console.error(`Reason: ${error.reason}`);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
