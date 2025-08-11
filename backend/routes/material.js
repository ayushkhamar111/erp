const express = require('express');
const router = express.Router();
const MaterialController = require('../Controllers/MaterialController');

// Create
router.post('/create',  MaterialController.create);

// Read all
router.post('/list',  MaterialController.list);

router.put('/update/:id', MaterialController.updateMaterial);

// Delete
router.delete('/delete/:id', MaterialController.deleteMaterial);

module.exports = router;
