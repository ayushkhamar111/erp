// validators/vendorValidator.js

function validateVendorInput(data) {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  } 

  if (data.mobile_no) {
    const mobile_no = data.mobile_no.toString().trim();

    if (!/^\d+$/.test(mobile_no)) {
      errors.push({ field: 'mobile_no', message: 'Mobile number must contain only digits' });
    } else if (mobile_no.length !== 10) {
      errors.push({ field: 'mobile_no', message: 'Mobile number must be exactly 10 digits' });
    }
  }

  return errors;
}

module.exports = { validateVendorInput };
