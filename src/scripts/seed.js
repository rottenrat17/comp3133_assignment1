require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Employee = require('../models/Employee');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comp3133_assignment1';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const existing = await User.findOne({ email: 'johndoe@example.com' });
    if (existing) {
      console.log('Sample user already exists. Skipping seed.');
      process.exit(0);
      return;
    }

    await User.create({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: 'password123',
    });
    console.log('Sample user created:');
    console.log('  Email:    johndoe@example.com');
    console.log('  Username: johndoe');
    console.log('  Password: password123');
    console.log('Use these to test the login mutation in GraphiQL or Postman.');

    const empExists = await Employee.findOne({ email: 'jane.doe@example.com' });
    if (!empExists) {
      await Employee.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        position: 'Software Engineer',
        salary: 90000,
        date_of_joining: new Date('2023-08-01'),
        department: 'Engineering',
      });
      console.log('Sample employee added (Jane Doe).');
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
