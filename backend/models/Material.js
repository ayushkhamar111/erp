const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const materialSchemaFields = {
  name: { type: String, required: true },
  ...baseModelFields
};

const MaterialSchema = new mongoose.Schema(materialSchemaFields);

applyBaseSchemaMiddleware(MaterialSchema);

module.exports = mongoose.model('Material', MaterialSchema);
