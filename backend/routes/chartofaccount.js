const express = require('express');
const router = express.Router();
const ChartOfAccountController = require('../Controllers/ChartOfAccountController');

router.post('/list',  ChartOfAccountController.list);

router.post('/store',  ChartOfAccountController.store);

router.delete('/delete/:id', ChartOfAccountController.deleteChartOfAccount);

module.exports = router;
