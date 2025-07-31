const express = require('express');
const router = express.Router();
const MaterialController = require('../Controllers/MaterialController');

const authenticate = require('../Middleware/AuthMiddleware');

// Create
router.post('/create',  MaterialController.create);

// Read all
router.post('/list',  MaterialController.list);

router.put('/update/:id', MaterialController.updateMaterial);

// Delete
router.delete('/delete/:id', MaterialController.deleteMaterial);

// router.delete('/:id', async (req, res) => {
//   await Branch.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Branch deleted' });
// });

module.exports = router;
