const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/add', clientController.addClientToEvent);

module.exports = router;