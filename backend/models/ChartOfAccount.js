const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const chartOfAccountSchemaFields = {
    account_type_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account_type',
        required: true
    },
    name: { type: String, required: true },
    ...baseModelFields
};

const chartOfAccountSchema = new mongoose.Schema(chartOfAccountSchemaFields);

applyBaseSchemaMiddleware(chartOfAccountSchema);

module.exports = mongoose.model('chart_of_account', chartOfAccountSchema);
