const Attendance = require('../models/Attendance');
const User = require('../models/User');

const formatDate = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};

exports.employeeStats = async (req,res) => {
  try {
    const userId = req.user._id;
    const today = formatDate(new Date());
    const todayAttendance = await Attendance.findOne({ userId, date: today });
    const month = (new Date()).getMonth()+1;
    const year = (new Date()).getFullYear();
    const regex = new RegExp(`^${year}-${String(month).padStart(2,'0')}`);
    const entries = await Attendance.find({ userId, date: { $regex: regex } });
    let present=0, absent=0, late=0, totalHours=0;
    entries.forEach(e => {
      if (e.status === 'present') present++;
      else if (e.status === 'late') late++;
      else if (e.status === 'absent') absent++;
      totalHours += e.totalHours || 0;
    });
    const recent = await Attendance.find({ userId }).sort({ date: -1 }).limit(7);
    res.json({
      todayStatus: todayAttendance ? (todayAttendance.checkInTime ? 'Checked In' : 'Not Checked In') : 'Not Checked In',
      month: { present, absent, late, totalHours },
      recent
    });
  } catch (err) { console.error('Employee stats error', err); res.status(500).json({message:'server error'}); }
};

exports.managerStats = async (req,res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const today = formatDate(new Date());
    const presentToday = await Attendance.countDocuments({ date: today, checkInTime: { $exists: true } });
    const lateToday = await Attendance.countDocuments({ date: today, status: 'late' });
    // Weekly trend (last 7 days)
    const trend = [];
    for (let i=6;i>=0;i--) {
      const d = new Date();
      d.setDate(d.getDate()-i);
      const dateStr = formatDate(d);
      const count = await Attendance.countDocuments({ date: dateStr, checkInTime: { $exists: true } });
      trend.push({ date: dateStr, present: count });
    }
    // department-wise attendance
    const deptAgg = await Attendance.aggregate([
      { $match: { checkInTime: { $exists: true } } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $group: { _id: '$user.department', count: { $sum: 1 } } }
    ]);
    res.json({ totalEmployees, presentToday, lateToday, trend, deptAgg });
  } catch (err) { console.error('Manager stats error', err); res.status(500).json({message:'server error'}); }
};
