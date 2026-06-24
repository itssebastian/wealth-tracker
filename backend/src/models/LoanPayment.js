const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoanPayment = sequelize.define('LoanPayment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  loanId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  paymentDate: { type: DataTypes.DATEONLY, allowNull: false },
  emiAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  principalComponent: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  interestComponent: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  outstandingAfterPayment: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'loan_payments' });

module.exports = LoanPayment;
