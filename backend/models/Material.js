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
  name: { type: String, required: true },
   unit_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'unit',
        required: true
  },
  type: {
        type: Number,
        enum: [GOODS, SERVICE],
        required: true
  },
  ...baseModelFields
};


const MaterialSchema = new mongoose.Schema(materialSchemaFields);

applyBaseSchemaMiddleware(MaterialSchema);

module.exports = mongoose.model('Material', MaterialSchema);
