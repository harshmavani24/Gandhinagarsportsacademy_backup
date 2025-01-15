const express = require('express');
const { fetchTransactions,fetchAccountsData ,AddNewTransaction} = require('../controllers/AccountController');

const router = express.Router();

router.post('/transactions',fetchTransactions);
router.post('/data',fetchAccountsData);
router.post('/transaction/add',AddNewTransaction);
module.exports = router;
