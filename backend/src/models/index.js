const sequelize = require('../config/database');
const User = require('./User');
const SavingsAccount = require('./SavingsAccount');
const FixedDeposit = require('./FixedDeposit');
const GoldInvestment = require('./GoldInvestment');
const SilverInvestment = require('./SilverInvestment');
const Loan = require('./Loan');
const LoanPayment = require('./LoanPayment');
const LoanPrepayment = require('./LoanPrepayment');
const Goal = require('./Goal');
const NetworthHistory = require('./NetworthHistory');

// Associations
User.hasMany(SavingsAccount, { foreignKey: 'userId', onDelete: 'CASCADE' });
SavingsAccount.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(FixedDeposit, { foreignKey: 'userId', onDelete: 'CASCADE' });
FixedDeposit.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(GoldInvestment, { foreignKey: 'userId', onDelete: 'CASCADE' });
GoldInvestment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SilverInvestment, { foreignKey: 'userId', onDelete: 'CASCADE' });
SilverInvestment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Loan, { foreignKey: 'userId', onDelete: 'CASCADE' });
Loan.belongsTo(User, { foreignKey: 'userId' });

Loan.hasMany(LoanPayment, { foreignKey: 'loanId', onDelete: 'CASCADE' });
LoanPayment.belongsTo(Loan, { foreignKey: 'loanId' });

Loan.hasMany(LoanPrepayment, { foreignKey: 'loanId', onDelete: 'CASCADE' });
LoanPrepayment.belongsTo(Loan, { foreignKey: 'loanId' });

User.hasMany(Goal, { foreignKey: 'userId', onDelete: 'CASCADE' });
Goal.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(NetworthHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
NetworthHistory.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  SavingsAccount,
  FixedDeposit,
  GoldInvestment,
  SilverInvestment,
  Loan,
  LoanPayment,
  LoanPrepayment,
  Goal,
  NetworthHistory,
};
