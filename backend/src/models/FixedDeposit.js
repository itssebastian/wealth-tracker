const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FixedDeposit = sequelize.define('FixedDeposit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bankName: { type: DataTypes.STRING(100), allowNull: false },
  fdNumber: { type: DataTypes.STRING(50) },
  principalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  interestRate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  maturityDate: { type: DataTypes.DATEONLY, allowNull: false },
  maturityAmount: { type: DataTypes.DECIMAL(15, 2) },
  compoundingFrequency: { type: DataTypes.ENUM('Monthly', 'Quarterly', 'Annually'), defaultValue: 'Quarterly' },
  notes: { type: DataTypes.TEXT },
  isMatured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'fixed_deposits' });

module.exports = FixedDeposit;
