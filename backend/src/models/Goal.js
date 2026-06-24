const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Goal = sequelize.define('Goal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  goalName: { type: DataTypes.STRING(100), allowNull: false },
  goalType: { type: DataTypes.ENUM('Emergency Fund', 'House Renovation', 'Car Purchase', 'Retirement', 'Child Education', 'Other'), defaultValue: 'Other' },
  targetAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  currentAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  targetDate: { type: DataTypes.DATEONLY, allowNull: false },
  notes: { type: DataTypes.TEXT },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'goals' });

module.exports = Goal;
