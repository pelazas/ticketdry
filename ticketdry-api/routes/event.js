const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('photo'), eventController.createEvent);
router.get('/all', eventController.getAllEvents); // de todos los eventos
router.get('/:organizerId', eventController.getAllEventsOfOrganizer); // de un organizador en particular
router.get('/', eventController.getAllFeaturedEvents); // de todos los eventos destacados

router.get('/id/:eventId', eventController.getEventById);
router.get('/fullId/:eventId', eventController.getFullEventById);

router.put('/id/:eventId', authMiddleware, upload.single('photo'), eventController.editEventById);
router.delete('/id/:eventId', authMiddleware, eventController.deleteEventById);

module.exports = router;
