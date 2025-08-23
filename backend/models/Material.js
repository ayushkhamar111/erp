const words = require("../lang/words.json");
const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const GOODS = 1;
const SERVICE =2;

const Type = {
  // GOODS : 'GOODS',
  // SERVICE : 'SERVICE',
    GOODS : words.goods,
    SERVICE : words.service,
};


const materialSchemaFields = {
    name: {type: String, required: true},
    unit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'unit',
        required: true
    },
    type: {
        type: Number,
        enum: [GOODS, SERVICE],
        required: true
    },
    code: {type: String, required: true},
    sac_code: {type: String},
    purchase_price: {type: Number},
    selling_price: {type: Number},
    mrp: {type: Number},
    opening_stock: {type: Number},
    opening_stock_value: {type: Number},
    minimum_stock_level: {type: Number},
    tax_status: {type: Number},
    gst_rate: {type: Number},
    service_rate: {type: Number},
    Warranty_period: {type: String},
    description: {type: String},
    ...baseModelFields

};

const MaterialSchema = new mongoose.Schema(materialSchemaFields);

applyBaseSchemaMiddleware(MaterialSchema);


const Material = mongoose.models.Material || mongoose.model('Material', MaterialSchema);

module.exports = Material;
// module.exports = mongoose.model('Material', MaterialSchema);
