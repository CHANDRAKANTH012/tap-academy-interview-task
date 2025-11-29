require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const seed = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await User.deleteMany();
    await Attendance.deleteMany();

    const manager = await User.create({
      name: 'Manager One',
      email: 'manager@example.com',
      password: 'password123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management',
      avatar: ''
    });

    const employees = [];
    const names = ['John Doe','Sarah Johnson','Mike Chen','Lisa Brown'];
    for (let i=0;i<names.length;i++){
      const emp = await User.create({
        name: names[i],
        email: `emp${i+1}@example.com`,
        password: 'password123',
        role: 'employee',
        employeeId: `EMP00${i+1}`,
        department: i%2===0 ? 'Engineering' : 'Sales',
        avatar: ''
      });
      employees.push(emp);
    }

    // seed attendance last 7 days
    const now = new Date();
    for (let d=0; d<7; d++){
      const date = new Date(); date.setDate(now.getDate()-d);
      const dateStr = date.toISOString().slice(0,10);
      for (const emp of employees) {
        const checkIn = new Date(date);
        const hour = 9 + Math.floor(Math.random() * 2); // 9 or 10
        const minute = Math.floor(Math.random() * 50);
        checkIn.setHours(hour, minute, 0, 0);
        const checkOut = new Date(checkIn);
        checkOut.setHours(checkIn.getHours() + 8);
        await Attendance.create({
          userId: emp._id,
          date: dateStr,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          status: (checkIn.getHours() > (parseInt(process.env.LATE_THRESHOLD_HOUR) || 9)) ? 'late' : 'present',
          totalHours: 8,
          location: 'Office'
        });
      }
    }

    console.log('Seed done. Manager: manager@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

seed();
