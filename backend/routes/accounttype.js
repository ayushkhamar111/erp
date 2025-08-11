const express = require('express');
const router = express.Router();
const AccountTypeController = require('../Controllers/AccountTypeController');

router.post('/list',  AccountTypeController.list);

router.post('/store',  AccountTypeController.store);

router.delete('/delete/:id', AccountTypeController.deleteAccountType);

module.exports = router;
