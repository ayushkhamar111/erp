const express = require('express');
const router = express.Router();
const VendorController = require('../Controllers/VendorController');

// Create
router.post('/create',  VendorController.create);

// Read all
router.post('/list',  VendorController.list);

router.put('/update/:id', VendorController.updateVendor);

// Delete
router.delete('/delete/:id', VendorController.deleteVendor);

module.exports = router;
