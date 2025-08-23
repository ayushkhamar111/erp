const express = require('express');
const router = express.Router();
const CategoryGroupController = require('../Controllers/CategoryGroupController');

router.get('/list',  CategoryGroupController.list);

router.post('/store',  CategoryGroupController.store);

router.delete('/delete/:id', CategoryGroupController.deleteCategoryGroup);

module.exports = router;