const { SavingsAccount, FixedDeposit, GoldInvestment, SilverInvestment, Loan, NetworthHistory } = require('../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const savings = await SavingsAccount.findAll({ where: { userId } });
    const fds = await FixedDeposit.findAll({ where: { userId } });
    const golds = await GoldInvestment.findAll({ where: { userId } });
    const silvers = await SilverInvestment.findAll({ where: { userId } });
    const loans = await Loan.findAll({ where: { userId, isActive: true } });

    const totalSavings = savings.reduce((s, a) => s + parseFloat(a.currentBalance), 0);
    const totalFD = fds.reduce((s, a) => s + parseFloat(a.maturityAmount || a.principalAmount), 0);
    const totalGold = golds.reduce((s, a) => s + parseFloat(a.quantity) * parseFloat(a.currentPrice), 0);
    const totalSilver = silvers.reduce((s, a) => s + parseFloat(a.quantity) * parseFloat(a.currentPrice), 0);
    const totalLoans = loans.reduce((s, l) => s + parseFloat(l.currentOutstanding), 0);

    const totalAssets = totalSavings + totalFD + totalGold + totalSilver;
    const netWorth = totalAssets - totalLoans;

    // Check FD maturity in 30 days
    const soon = dayjs().add(30, 'day').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    const maturingFDs = fds.filter(f => f.maturityDate >= today && f.maturityDate <= soon);

    // Check EMI due in 5 days
    const emiDue = dayjs().add(5, 'day').format('YYYY-MM-DD');
    const dueEMIs = loans.filter(l => {
      const start = dayjs(l.loanStartDate);
      const day = start.date();
      const nextDue = dayjs().date(day);
      const dueDateStr = (nextDue.isBefore(dayjs()) ? nextDue.add(1, 'month') : nextDue).format('YYYY-MM-DD');
      return dueDateStr <= emiDue;
    });

    const notifications = [
      ...maturingFDs.map(f => ({ type: 'FD', message: `FD at ${f.bankName} matures on ${f.maturityDate}`, severity: 'warning' })),
      ...dueEMIs.map(l => ({ type: 'EMI', message: `EMI of ₹${l.emiAmount} due for ${l.bankName} loan`, severity: 'info' })),
    ];

    res.json({
      success: true,
      data: {
        totalSavings,
        totalFD,
        totalGold,
        totalSilver,
        totalAssets,
        totalLiabilities: totalLoans,
        netWorth,
        assetAllocation: {
          savings: totalAssets ? ((totalSavings / totalAssets) * 100).toFixed(1) : 0,
          fd: totalAssets ? ((totalFD / totalAssets) * 100).toFixed(1) : 0,
          gold: totalAssets ? ((totalGold / totalAssets) * 100).toFixed(1) : 0,
          silver: totalAssets ? ((totalSilver / totalAssets) * 100).toFixed(1) : 0,
        },
        notifications,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNetworthTrend = async (req, res) => {
  try {
    const history = await NetworthHistory.findAll({
      where: { userId: req.user.id },
      order: [['recordDate', 'ASC']],
      limit: 12,
    });
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.recordNetworth = async (req, res) => {
  try {
    const userId = req.user.id;
    const savings = await SavingsAccount.findAll({ where: { userId } });
    const fds = await FixedDeposit.findAll({ where: { userId } });
    const golds = await GoldInvestment.findAll({ where: { userId } });
    const silvers = await SilverInvestment.findAll({ where: { userId } });
    const loans = await Loan.findAll({ where: { userId, isActive: true } });

    const totalSavings = savings.reduce((s, a) => s + parseFloat(a.currentBalance), 0);
    const totalFD = fds.reduce((s, a) => s + parseFloat(a.maturityAmount || a.principalAmount), 0);
    const totalGold = golds.reduce((s, a) => s + parseFloat(a.quantity) * parseFloat(a.currentPrice), 0);
    const totalSilver = silvers.reduce((s, a) => s + parseFloat(a.quantity) * parseFloat(a.currentPrice), 0);
    const totalLoans = loans.reduce((s, l) => s + parseFloat(l.currentOutstanding), 0);

    const record = await NetworthHistory.create({
      userId,
      recordDate: dayjs().format('YYYY-MM-DD'),
      totalSavings, totalFD, totalGold, totalSilver,
      totalLiabilities: totalLoans,
      netWorth: totalSavings + totalFD + totalGold + totalSilver - totalLoans,
    });

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
