const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NetworthHistory = sequelize.define('NetworthHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  recordDate: { type: DataTypes.DATEONLY, allowNull: false },
  totalSavings: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  totalFD: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  totalGold: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  totalSilver: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  totalLiabilities: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  netWorth: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
}, { tableName: 'networth_history' });

module.exports = NetworthHistory;
