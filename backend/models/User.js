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
    default: 1  
  },
  ...baseModelFields  
};

const UserSchema = new mongoose.Schema(userSchemaFields);

applyBaseSchemaMiddleware(UserSchema);

UserSchema.statics.STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
};


module.exports = mongoose.model('User', UserSchema);

