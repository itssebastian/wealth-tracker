const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loan = sequelize.define('Loan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bankName: { type: DataTypes.STRING(100), allowNull: false },
  loanType: { type: DataTypes.ENUM('Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan', 'Other'), defaultValue: 'Home Loan' },
  loanAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  interestRate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  loanStartDate: { type: DataTypes.DATEONLY, allowNull: false },
  loanTenureMonths: { type: DataTypes.INTEGER, allowNull: false },
  currentOutstanding: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  emiAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  accountNumber: { type: DataTypes.STRING(50) },
  notes: { type: DataTypes.TEXT },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'loans' });

module.exports = Loan;
