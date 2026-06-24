const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavingsAccount = sequelize.define('SavingsAccount', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bankName: { type: DataTypes.STRING(100), allowNull: false },
  accountType: { type: DataTypes.ENUM('Savings', 'Current', 'Salary', 'NRI'), defaultValue: 'Savings' },
  currentBalance: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  accountNumber: { type: DataTypes.STRING(50) },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'savings_accounts' });

module.exports = SavingsAccount;
