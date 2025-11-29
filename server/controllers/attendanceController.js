const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { createObjectCsvStringifier } = require('csv-writer');

const formatDate = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};

const getLateThresholdHour = () => {
  const env = parseInt(process.env.LATE_THRESHOLD_HOUR);
  return isNaN(env) ? 9 : env;
};

exports.checkin = async (req,res) => {
  try {
    const userId = req.user._id;
    const today = formatDate(new Date());
    let attendance = await Attendance.findOne({ userId, date: today });
    const now = new Date();
    if (attendance && attendance.checkInTime) return res.status(400).json({ message: 'Already checked in' });

    const lateThresholdHour = getLateThresholdHour();
    const status = (now.getHours() > lateThresholdHour) ? 'late' : 'present';

    if (!attendance) {
      attendance = await Attendance.create({ userId, date: today, checkInTime: now, status, location: req.body.location || '' });
    } else {
      attendance.checkInTime = now;
      attendance.status = status;
      attendance.location = req.body.location || attendance.location;
      await attendance.save();
    }
    res.json({ attendance });
  } catch (err) {
    console.error('Checkin error', err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.checkout = async (req,res) => {
  try {
    const userId = req.user._id;
    const today = formatDate(new Date());
    const attendance = await Attendance.findOne({ userId, date: today });
    if (!attendance || !attendance.checkInTime) return res.status(400).json({ message: 'No checkin found' });
    if (attendance.checkOutTime) return res.status(400).json({ message: 'Already checked out' });

    const now = new Date();
    attendance.checkOutTime = now;
    const diffMs = new Date(attendance.checkOutTime) - new Date(attendance.checkInTime);
    attendance.totalHours = Math.round((diffMs/ (1000*60*60)) * 100) / 100; // hours with 2 decimals
    await attendance.save();
    res.json({ attendance });
  } catch (err) {
    console.error('Checkout error', err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.myHistory = async (req,res) => {
  try {
    const userId = req.user._id;
    const entries = await Attendance.find({ userId }).sort({ date:-1 }).limit(500);
    res.json({ entries });
  } catch (err) {
    console.error('My history error', err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.mySummary = async (req,res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;
    const now = new Date();
    const qMonth = parseInt(month) || (now.getMonth()+1);
    const qYear = parseInt(year) || now.getFullYear();

    const regex = new RegExp(`^${qYear}-${String(qMonth).padStart(2,'0')}`);
    const entries = await Attendance.find({ userId, date: { $regex: regex } });
    let present=0, absent=0, late=0, half=0, totalHours=0;
    entries.forEach(e => {
      if (e.status === 'present') present++;
      else if (e.status === 'late') late++;
      else if (e.status === 'half-day') half++;
      else if (e.status === 'absent') absent++;
      totalHours += e.totalHours || 0;
    });
    res.json({ present, absent, late, half, totalHours, entriesCount: entries.length });
  } catch (err) {
    console.error('My summary error', err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.today = async (req,res) => {
  try {
    const userId = req.user._id;
    const today = formatDate(new Date());
    const attendance = await Attendance.findOne({ userId, date: today });
    res.json({ attendance });
  } catch(err){ console.error('Today error', err); res.status(500).json({message:'server error'}); }
};

// Manager endpoints
exports.getAll = async (req,res) => {
  try {
    const { page = 1, limit = 100, employeeId, start, end } = req.query;
    const skip = (page-1)*limit;
    const filter = {};
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) filter.userId = user._id;
      else return res.json({ entries: [] });
    }
    if (start && end) {
      filter.date = { $gte: start, $lte: end };
    }
    const entries = await Attendance.find(filter).sort({date:-1}).skip(parseInt(skip)).limit(parseInt(limit)).populate('userId','name email employeeId department');
    res.json({ entries });
  } catch(err){ console.error('Get all error', err); res.status(500).json({message:'server error'}); }
};

exports.getEmployee = async (req,res) => {
  try {
    const { id } = req.params;
    const entries = await Attendance.find({ userId: id }).sort({ date:-1 }).populate('userId','name email employeeId department');
    res.json({ entries });
  } catch(err){ console.error('Get employee error', err); res.status(500).json({message:'server error'}); }
};

exports.summary = async (req,res) => {
  try {
    const today = formatDate(new Date());
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const presentToday = await Attendance.countDocuments({ date: today, checkInTime: { $exists: true } });
    const lateToday = await Attendance.countDocuments({ date: today, status: 'late' });
    const absentToday = Math.max(0, totalEmployees - presentToday);
    res.json({ totalEmployees, presentToday, absentToday, lateToday });
  } catch(err){ console.error('Summary error', err); res.status(500).json({message:'server error'}); }
};

exports.todayStatus = async (req,res) => {
  try {
    const today = formatDate(new Date());
    const entries = await Attendance.find({ date: today, checkInTime: { $exists: true } }).populate('userId','name employeeId department');
    res.json({ entries });
  } catch(err){ console.error('Today status error', err); res.status(500).json({message:'server error'}); }
};

exports.exportCSV = async (req,res) => {
  try {
    const { start, end, employeeId } = req.query; // dates YYYY-MM-DD
    let filter = {};
    if (start && end) {
      filter.date = { $gte: start, $lte: end };
    }
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (!user) return res.status(400).json({ message: 'No such employeeId' });
      filter.userId = user._id;
    }
    const entries = await Attendance.find(filter).populate('userId','name email employeeId department').sort({ date: -1 });
    const csvStringifier = createObjectCsvStringifier({
      header: [
        {id: 'employeeId', title: 'EmployeeId'},
        {id: 'name', title: 'Name'},
        {id: 'department', title: 'Department'},
        {id: 'date', title: 'Date'},
        {id: 'checkIn', title: 'CheckIn'},
        {id: 'checkOut', title: 'CheckOut'},
        {id: 'status', title: 'Status'},
        {id: 'totalHours', title: 'TotalHours'}
      ]
    });
    const records = entries.map(e => ({
      employeeId: e.userId.employeeId,
      name: e.userId.name,
      department: e.userId.department,
      date: e.date,
      checkIn: e.checkInTime ? e.checkInTime.toISOString() : '',
      checkOut: e.checkOutTime ? e.checkOutTime.toISOString() : '',
      status: e.status || '',
      totalHours: e.totalHours || 0
    }));
    const header = csvStringifier.getHeaderString();
    const body = csvStringifier.stringifyRecords(records);
    const csv = header + body;
    res.setHeader('Content-disposition', 'attachment; filename=attendance_export.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  } catch(err){ console.error('Export CSV error', err); res.status(500).json({message:'server error'}); }
};
