const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authCtrl = require('../controllers/authController');
const dashCtrl = require('../controllers/dashboardController');
const wealthCtrl = require('../controllers/wealthController');
const loanCtrl = require('../controllers/loanController');
const goalCtrl = require('../controllers/goalController');

// Auth
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', auth, authCtrl.getMe);
router.put('/auth/profile', auth, authCtrl.updateProfile);

// Dashboard
router.get('/dashboard/summary', auth, dashCtrl.getSummary);
router.get('/dashboard/networth-trend', auth, dashCtrl.getNetworthTrend);
router.post('/dashboard/record-networth', auth, dashCtrl.recordNetworth);

// Savings
router.get('/wealth/savings', auth, wealthCtrl.getSavings);
router.post('/wealth/savings', auth, wealthCtrl.createSavings);
router.put('/wealth/savings/:id', auth, wealthCtrl.updateSavings);
router.delete('/wealth/savings/:id', auth, wealthCtrl.deleteSavings);

// FDs
router.get('/wealth/fds', auth, wealthCtrl.getFDs);
router.post('/wealth/fds', auth, wealthCtrl.createFD);
router.put('/wealth/fds/:id', auth, wealthCtrl.updateFD);
router.delete('/wealth/fds/:id', auth, wealthCtrl.deleteFD);

// Gold
router.get('/wealth/gold', auth, wealthCtrl.getGold);
router.post('/wealth/gold', auth, wealthCtrl.createGold);
router.put('/wealth/gold/:id', auth, wealthCtrl.updateGold);
router.delete('/wealth/gold/:id', auth, wealthCtrl.deleteGold);

// Silver
router.get('/wealth/silver', auth, wealthCtrl.getSilver);
router.post('/wealth/silver', auth, wealthCtrl.createSilver);
router.put('/wealth/silver/:id', auth, wealthCtrl.updateSilver);
router.delete('/wealth/silver/:id', auth, wealthCtrl.deleteSilver);

// Loans
router.get('/loans', auth, loanCtrl.getLoans);
router.post('/loans', auth, loanCtrl.createLoan);
router.put('/loans/:id', auth, loanCtrl.updateLoan);
router.delete('/loans/:id', auth, loanCtrl.deleteLoan);
router.get('/loans/:loanId/payments', auth, loanCtrl.getPayments);
router.post('/loans/:loanId/payments', auth, loanCtrl.addPayment);
router.get('/loans/:loanId/prepayments', auth, loanCtrl.getPrepayments);
router.post('/loans/:loanId/prepayments', auth, loanCtrl.addPrepayment);

// Goals
router.get('/goals', auth, goalCtrl.getGoals);
router.post('/goals', auth, goalCtrl.createGoal);
router.put('/goals/:id', auth, goalCtrl.updateGoal);
router.delete('/goals/:id', auth, goalCtrl.deleteGoal);

module.exports = router;
