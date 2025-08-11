const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const accountTypeSchemaFields = {
    name: { type: String, required: true },
    ...baseModelFields
};

const accountTypeSchema = new mongoose.Schema(accountTypeSchemaFields);

applyBaseSchemaMiddleware(accountTypeSchema);

module.exports = mongoose.model('account_type', accountTypeSchema);
