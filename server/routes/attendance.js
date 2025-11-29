const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const controller = require('../controllers/attendanceController');

router.post('/checkin', auth, permit('employee','manager'), controller.checkin);
router.post('/checkout', auth, permit('employee','manager'), controller.checkout);
router.get('/my-history', auth, permit('employee','manager'), controller.myHistory);
router.get('/my-summary', auth, permit('employee','manager'), controller.mySummary);
router.get('/today', auth, permit('employee','manager'), controller.today);

router.get('/all', auth, permit('manager'), controller.getAll);
router.get('/employee/:id', auth, permit('manager'), controller.getEmployee);
router.get('/summary', auth, permit('manager'), controller.summary);
router.get('/today-status', auth, permit('manager'), controller.todayStatus);
router.get('/export', auth, permit('manager'), controller.exportCSV);

module.exports = router;
