const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  branchName: String
});

module.exports = mongoose.model('Branch', BranchSchema);
