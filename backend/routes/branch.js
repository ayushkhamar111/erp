const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');

// Create
router.post('/', async (req, res) => {
  const { branchName } = req.body;
  const branch = new Branch({ branchName });
  await branch.save();
  res.json(branch);
});

// Read all
router.get('/', async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

// Update
router.put('/:id', async (req, res) => {
  const { branchName } = req.body;
  const branch = await Branch.findByIdAndUpdate(req.params.id, { branchName }, { new: true });
  res.json(branch);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.json({ message: 'Branch deleted' });
});

module.exports = router;
