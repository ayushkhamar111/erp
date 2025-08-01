// validators/vendorValidator.js
const messages = require('../lang/messages.json');

function validateVendorInput(data) {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: messages.name_required });
  } 

  if (data.mobile_no) {
    const mobile_no = data.mobile_no.toString().trim();

    if (!/^\d+$/.test(mobile_no)) {
      errors.push({ field: 'mobile_no', message: messages.mobile_no_validation });
    } else if (mobile_no.length !== 10) {
      errors.push({ field: 'mobile_no', message: messages.mobile_no__min_maxvalidation });
    }
  }

  return errors;
}

module.exports = { validateVendorInput };
