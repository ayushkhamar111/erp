const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const categoryGroupSchemaFields = {
    name: { type: String, required: true ,unique: true
    },

    ...baseModelFields
};

const categoryGroupSchema = new mongoose.Schema(categoryGroupSchemaFields);

applyBaseSchemaMiddleware(categoryGroupSchema);


module.exports =
    mongoose.models.category_group ||
    mongoose.model('category_group', categoryGroupSchema);
