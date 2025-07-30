// models/baseModel.js
const mongoose = require('mongoose');

const baseModelFields = {
  status: {
    type: Number,
    default: 1
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deleted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  deleted_at: {
    type: Date
  }
};

const applyBaseSchemaMiddleware = (schema) => {
  // Automatically update the updated_at field before save
  schema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
  });

 schema.methods.softDelete = async function (userId) {
    this.status = 2;
    this.deleted_by = userId;
    this.deleted_at = new Date();
    await this.save();
  };

};

module.exports = { baseModelFields, applyBaseSchemaMiddleware };
