require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize, User, SavingsAccount, FixedDeposit, GoldInvestment, SilverInvestment, Loan, Goal, NetworthHistory } = require('../models');
const dayjs = require('dayjs');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log('Tables created');

  const user = await User.create({
    name: 'Demo User',
    email: 'demo@wealthtracker.in',
    password: 'Demo@1234',
    currency: 'INR',
    theme: 'dark',
  });

  await SavingsAccount.bulkCreate([
    { userId: user.id, bankName: 'SBI', accountType: 'Savings', currentBalance: 35000 },
    { userId: user.id, bankName: 'HDFC', accountType: 'Savings', currentBalance: 40000 },
    { userId: user.id, bankName: 'ICICI', accountType: 'Salary', currentBalance: 25000 },
  ]);

  await FixedDeposit.bulkCreate([
    { userId: user.id, bankName: 'SBI', fdNumber: 'SBI-FD-001', principalAmount: 100000, interestRate: 7.1, startDate: '2024-01-01', maturityDate: '2025-01-01', maturityAmount: 107100, compoundingFrequency: 'Quarterly' },
  ]);

  // Gold: ₹50,000 worth at current price ₹7200/g => ~6.94g
  await GoldInvestment.bulkCreate([
    { userId: user.id, type: 'Physical Gold', quantity: 6.94, purchasePrice: 6500, currentPrice: 7200, purchaseDate: '2023-06-01', notes: 'Jewellery' },
    { userId: user.id, type: 'Sovereign Gold Bond', quantity: 5, purchasePrice: 5900, currentPrice: 7200, purchaseDate: '2022-03-15' },
  ]);

  // Silver: ₹25,000 at ₹90/g => ~277g
  await SilverInvestment.bulkCreate([
    { userId: user.id, type: 'Physical Silver', quantity: 277, purchasePrice: 75, currentPrice: 90, purchaseDate: '2023-01-10' },
  ]);

  await Loan.create({
    userId: user.id,
    bankName: 'SBI Home Loans',
    loanType: 'Home Loan',
    loanAmount: 2500000,
    interestRate: 8.72,
    loanStartDate: '2021-04-01',
    loanTenureMonths: 270,
    currentOutstanding: 1675000,
    emiAmount: 14189,
    accountNumber: 'SBI-HL-2021-001',
  });

  await Goal.bulkCreate([
    { userId: user.id, goalName: 'Emergency Fund', goalType: 'Emergency Fund', targetAmount: 300000, currentAmount: 100000, targetDate: '2025-12-31' },
    { userId: user.id, goalName: 'Car Purchase', goalType: 'Car Purchase', targetAmount: 800000, currentAmount: 150000, targetDate: '2026-06-30' },
    { userId: user.id, goalName: 'Child Education', goalType: 'Child Education', targetAmount: 2000000, currentAmount: 50000, targetDate: '2035-01-01' },
  ]);

  // Seed 6 months of networth history
  const months = [
    { m: -5, nw: 230000 }, { m: -4, nw: 245000 }, { m: -3, nw: 255000 },
    { m: -2, nw: 268000 }, { m: -1, nw: 280000 }, { m: 0, nw: 295000 },
  ];
  await NetworthHistory.bulkCreate(months.map(({ m, nw }) => ({
    userId: user.id,
    recordDate: dayjs().add(m, 'month').format('YYYY-MM-DD'),
    totalSavings: 100000, totalFD: 100000, totalGold: 50000, totalSilver: 25000,
    totalLiabilities: 1675000 - m * 5000,
    netWorth: nw,
  })));

  console.log('✅ Seed complete');
  console.log('📧 Email: demo@wealthtracker.in');
  console.log('🔑 Password: Demo@1234');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
