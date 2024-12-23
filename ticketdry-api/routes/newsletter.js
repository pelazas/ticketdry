const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

router.post('/', newsletterController.addNewsletterEmail);

module.exports = router;
