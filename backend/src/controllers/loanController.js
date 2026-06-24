const { Loan, LoanPayment, LoanPrepayment } = require('../models');

// ─── Loans ────────────────────────────────────────────────────────────────────
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({ where: { userId: req.user.id } });
    const enriched = await Promise.all(loans.map(async (loan) => {
      const payments = await LoanPayment.findAll({ where: { loanId: loan.id } });
      const prepayments = await LoanPrepayment.findAll({ where: { loanId: loan.id } });
      const totalPaid = payments.reduce((s, p) => s + parseFloat(p.emiAmount), 0);
      const totalInterest = payments.reduce((s, p) => s + parseFloat(p.interestComponent), 0);
      const totalPrincipalPaid = payments.reduce((s, p) => s + parseFloat(p.principalComponent), 0);
      const totalPrepaid = prepayments.reduce((s, p) => s + parseFloat(p.amount), 0);
      return {
        ...loan.toJSON(),
        totalPaid: totalPaid + totalPrepaid,
        totalInterestPaid: totalInterest,
        totalPrincipalPaid: totalPrincipalPaid + totalPrepaid,
        loanProgressPct: (((parseFloat(loan.loanAmount) - parseFloat(loan.currentOutstanding)) / parseFloat(loan.loanAmount)) * 100).toFixed(1),
      };
    }));
    res.json({ success: true, data: enriched });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createLoan = async (req, res) => {
  try {
    const loan = await Loan.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: loan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!loan) return res.status(404).json({ success: false, message: 'Not found' });
    await loan.update(req.body);
    res.json({ success: true, data: loan });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!loan) return res.status(404).json({ success: false, message: 'Not found' });
    await loan.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Payments ─────────────────────────────────────────────────────────────────
exports.getPayments = async (req, res) => {
  try {
    const loan = await Loan.findOne({ where: { id: req.params.loanId, userId: req.user.id } });
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    const payments = await LoanPayment.findAll({ where: { loanId: loan.id }, order: [['paymentDate', 'DESC']] });
    res.json({ success: true, data: payments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addPayment = async (req, res) => {
  try {
    const loan = await Loan.findOne({ where: { id: req.params.loanId, userId: req.user.id } });
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    const payment = await LoanPayment.create({ ...req.body, loanId: loan.id, userId: req.user.id });
    // update outstanding
    await loan.update({ currentOutstanding: req.body.outstandingAfterPayment });
    res.status(201).json({ success: true, data: payment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── Prepayments ──────────────────────────────────────────────────────────────
exports.getPrepayments = async (req, res) => {
  try {
    const loan = await Loan.findOne({ where: { id: req.params.loanId, userId: req.user.id } });
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    const prepayments = await LoanPrepayment.findAll({ where: { loanId: loan.id }, order: [['prepaymentDate', 'DESC']] });
    res.json({ success: true, data: prepayments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.addPrepayment = async (req, res) => {
  try {
    const loan = await Loan.findOne({ where: { id: req.params.loanId, userId: req.user.id } });
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    const { amount, prepaymentDate, notes } = req.body;

    const outstanding = parseFloat(loan.currentOutstanding);
    const outstandingAfter = outstanding - parseFloat(amount);
    const rate = parseFloat(loan.interestRate) / 100 / 12;

    // Simple interest saved calc
    const monthlyInterestOld = outstanding * rate;
    const monthlyInterestNew = outstandingAfter * rate;
    const interestSaved = (monthlyInterestOld - monthlyInterestNew) * 12; // approx annual
    const monthsSaved = Math.round(parseFloat(amount) / parseFloat(loan.emiAmount));

    const prepayment = await LoanPrepayment.create({
      loanId: loan.id, userId: req.user.id, prepaymentDate, amount,
      outstandingAfterPrepayment: outstandingAfter,
      interestSaved: interestSaved.toFixed(2),
      monthsSaved, notes,
    });
    await loan.update({ currentOutstanding: outstandingAfter });
    res.status(201).json({ success: true, data: prepayment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
