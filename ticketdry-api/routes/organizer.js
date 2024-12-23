const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.fields([
    {name: 'profilePhoto', maxCount: 1},
    {name: 'photos', maxCount: 10}
]), organizerController.createOrganizer);

router.get('/', organizerController.getAllOrganizers);
router.get('/:organizerId', organizerController.getOrganizer);
module.exports = router;
