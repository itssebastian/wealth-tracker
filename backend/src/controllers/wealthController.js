const { SavingsAccount, FixedDeposit, GoldInvestment, SilverInvestment } = require('../models');
const dayjs = require('dayjs');

// ─── Savings ─────────────────────────────────────────────────────────────────
exports.getSavings = async (req, res) => {
  try {
    const data = await SavingsAccount.findAll({ where: { userId: req.user.id } });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSavings = async (req, res) => {
  try {
    const account = await SavingsAccount.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: account });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSavings = async (req, res) => {
  try {
    const account = await SavingsAccount.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!account) return res.status(404).json({ success: false, message: 'Not found' });
    await account.update(req.body);
    res.json({ success: true, data: account });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSavings = async (req, res) => {
  try {
    const account = await SavingsAccount.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!account) return res.status(404).json({ success: false, message: 'Not found' });
    await account.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Fixed Deposits ───────────────────────────────────────────────────────────
const calcMaturity = (principal, rate, start, end, freq) => {
  const years = dayjs(end).diff(dayjs(start), 'day') / 365;
  const n = freq === 'Monthly' ? 12 : freq === 'Quarterly' ? 4 : 1;
  return principal * Math.pow(1 + rate / 100 / n, n * years);
};

exports.getFDs = async (req, res) => {
  try {
    const data = await FixedDeposit.findAll({ where: { userId: req.user.id } });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createFD = async (req, res) => {
  try {
    const { principalAmount, interestRate, startDate, maturityDate, compoundingFrequency } = req.body;
    const maturityAmount = calcMaturity(principalAmount, interestRate, startDate, maturityDate, compoundingFrequency || 'Quarterly');
    const fd = await FixedDeposit.create({ ...req.body, maturityAmount: maturityAmount.toFixed(2), userId: req.user.id });
    res.status(201).json({ success: true, data: fd });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateFD = async (req, res) => {
  try {
    const fd = await FixedDeposit.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!fd) return res.status(404).json({ success: false, message: 'Not found' });
    const { principalAmount, interestRate, startDate, maturityDate, compoundingFrequency } = { ...fd.dataValues, ...req.body };
    const maturityAmount = calcMaturity(principalAmount, interestRate, startDate, maturityDate, compoundingFrequency);
    await fd.update({ ...req.body, maturityAmount: maturityAmount.toFixed(2) });
    res.json({ success: true, data: fd });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteFD = async (req, res) => {
  try {
    const fd = await FixedDeposit.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!fd) return res.status(404).json({ success: false, message: 'Not found' });
    await fd.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Gold ─────────────────────────────────────────────────────────────────────
exports.getGold = async (req, res) => {
  try {
    const data = await GoldInvestment.findAll({ where: { userId: req.user.id } });
    const enriched = data.map(g => ({
      ...g.toJSON(),
      currentValue: (parseFloat(g.quantity) * parseFloat(g.currentPrice)).toFixed(2),
      profitLoss: ((parseFloat(g.currentPrice) - parseFloat(g.purchasePrice)) * parseFloat(g.quantity)).toFixed(2),
    }));
    res.json({ success: true, data: enriched });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createGold = async (req, res) => {
  try {
    const item = await GoldInvestment.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateGold = async (req, res) => {
  try {
    const item = await GoldInvestment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    await item.update(req.body);
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteGold = async (req, res) => {
  try {
    const item = await GoldInvestment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    await item.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Silver ───────────────────────────────────────────────────────────────────
exports.getSilver = async (req, res) => {
  try {
    const data = await SilverInvestment.findAll({ where: { userId: req.user.id } });
    const enriched = data.map(s => ({
      ...s.toJSON(),
      currentValue: (parseFloat(s.quantity) * parseFloat(s.currentPrice)).toFixed(2),
      profitLoss: ((parseFloat(s.currentPrice) - parseFloat(s.purchasePrice)) * parseFloat(s.quantity)).toFixed(2),
    }));
    res.json({ success: true, data: enriched });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createSilver = async (req, res) => {
  try {
    const item = await SilverInvestment.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateSilver = async (req, res) => {
  try {
    const item = await SilverInvestment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    await item.update(req.body);
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteSilver = async (req, res) => {
  try {
    const item = await SilverInvestment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    await item.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
