const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoanPrepayment = sequelize.define('LoanPrepayment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  loanId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  prepaymentDate: { type: DataTypes.DATEONLY, allowNull: false },
  amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  outstandingAfterPrepayment: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  interestSaved: { type: DataTypes.DECIMAL(15, 2) },
  monthsSaved: { type: DataTypes.INTEGER },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'loan_prepayments' });

module.exports = LoanPrepayment;
