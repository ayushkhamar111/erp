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
  ...baseModelFields  
};

const UserSchema = new mongoose.Schema(userSchemaFields);

applyBaseSchemaMiddleware(UserSchema);

module.exports = mongoose.model('User', UserSchema);
