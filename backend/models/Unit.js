const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const unitSchemaFields = {
    name: { type: String, required: true ,    unique: true
    },
    description: { type: String, required: true },
    ...baseModelFields
};

const unitSchema = new mongoose.Schema(unitSchemaFields);

applyBaseSchemaMiddleware(unitSchema);

// module.exports = mongoose.model('unit', unitSchema);
const Unit = mongoose.models.Unit || mongoose.model('Unit', unitSchema);

module.exports = Unit;