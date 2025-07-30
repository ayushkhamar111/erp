const ACTIVE = 1;
const INACTIVE = 2;

const STATUSES = {
  [ACTIVE]: 'Active',
  [INACTIVE]: 'Inactive'
};

const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const userSchemaFields = {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: ACTIVE  
  },
  ...baseModelFields  
};

const UserSchema = new mongoose.Schema(userSchemaFields);

applyBaseSchemaMiddleware(UserSchema);

module.exports = mongoose.model('User', UserSchema);

