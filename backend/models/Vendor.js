const mongoose = require('mongoose');
const { baseModelFields, applyBaseSchemaMiddleware } = require('./Base');

const vendorSchemaFields = {
  name: { type: String, required: true },
  mobile_no: { type: Number, required: false },
  email: { type: String, required: false },
  addrss: { type: String, required: false },
  ...baseModelFields
};

const VendorSchema = new mongoose.Schema(vendorSchemaFields);

applyBaseSchemaMiddleware(VendorSchema);

module.exports = mongoose.model('Vendor', VendorSchema);
