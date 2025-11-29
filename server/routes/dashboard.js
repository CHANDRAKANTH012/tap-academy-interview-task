const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const { employeeStats, managerStats } = require('../controllers/dashboardController');

router.get('/employee', auth, permit('employee','manager'), employeeStats);
router.get('/manager', auth, permit('manager'), managerStats);

module.exports = router;
