const express = require('express');
const router = express.Router();
const PayerController = require('../controllers/payerController');

router.get('/', PayerController.getAllPayers);
router.get('/search', PayerController.searchPayers);
router.post('/payers', PayerController.addPayer); // Add this route
router.delete('/payers/:id', PayerController.deletePayer);
router.put('/payers/:id', PayerController.updatePayer);

module.exports = router;
