const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoldInvestment = sequelize.define('GoldInvestment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('Physical Gold', 'Gold ETF', 'Sovereign Gold Bond'), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 4), allowNull: false, comment: 'in grams' },
  purchasePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: 'per gram' },
  currentPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: 'per gram' },
  purchaseDate: { type: DataTypes.DATEONLY, allowNull: false },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'gold_investments' });

module.exports = GoldInvestment;
