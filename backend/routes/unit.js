const express = require('express');
const router = express.Router();
const UnitController = require('../Controllers/UnitController');

router.get('/list',  UnitController.list);

router.post('/store',  UnitController.store);

router.delete('/delete/:id', UnitController.deleteUnit);

module.exports = router;