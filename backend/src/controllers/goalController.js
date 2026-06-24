const { Goal } = require('../models');

exports.getGoals = async (req, res) => {
  try {
    const data = await Goal.findAll({ where: { userId: req.user.id } });
    const enriched = data.map(g => ({
      ...g.toJSON(),
      progressPct: ((parseFloat(g.currentAmount) / parseFloat(g.targetAmount)) * 100).toFixed(1),
    }));
    res.json({ success: true, data: enriched });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: goal });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!goal) return res.status(404).json({ success: false, message: 'Not found' });
    await goal.update(req.body);
    res.json({ success: true, data: goal });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!goal) return res.status(404).json({ success: false, message: 'Not found' });
    await goal.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
