const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('photo'), cityController.addCity);
router.get('/no-images', cityController.getCitiesNoImages);
router.get('/images', cityController.getCitiesWithImages);
router.get('/:cityName', cityController.getOrganizersByCityName);

module.exports = router;