const express = require('express');
const router = express.Router();
const GstConfigurationController = require('../Controllers/GstConfigurationController');

router.get('/tax-status',  GstConfigurationController.taxStatus);

router.get('/gst-rate',  GstConfigurationController.gstRate);


module.exports = router;
