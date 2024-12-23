const User = require('../models/User');
const Event = require('../models/Event');
const Organizer = require('../models/Organizer');
const Attendee = require('../models/Attendee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    try {
        console.log("Registering user " + req.body.username)
        // if role is organizer, then organizerId comes in req.body else it is null
        const { username, password, role, organizerId } = req.body;

        if(role === "organizer") {
            const organizer = await Organizer.findById(organizerId);
            if(!organizer) return res.status(400).json({ message: 'Organizer not found' });
        }

        const userExist = await User.findOne({ username });

        if(userExist) return res.status(400).json({ message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, organizerId, role, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' });
        res.status(200).json({ token, role: user.role, organizerId: user.organizerId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.scanTicket = async (req, res) => {
    try {
        // if the user is not an admin, then the user can only scan tickets for his own organizer
        if(req.user.role !== "admin" && req.user.organizerId == null) 
            return res.status(403).json({ message: 'Unauthorized' });

        const { clientId, attendeeName } = req.query;
        const user = req.user;

        const client = await Client.findById(clientId);
        if(!client) return res.status(400).json({ message: 'Client not found' });

        // the attendeeName comes formatted from the paymentController (remove spaces to _ and lowercase)
        // so we need to go throught the attendees with the clientId and find the attendee with the name in the format attendeeName
        let attendee = null;
        for(const attendeeId of client.attendees){
            const thisAttendee = await Attendee.findById(attendeeId);
            if(thisAttendee.name.replace(/ /g, '_').toLowerCase() === attendeeName) {
                attendee = thisAttendee;
                break;
            }
        }

        if(!attendee) return res.status(208).json({ message: 'Asistente no encontrado' });
        // parse scantime to hours and minutes
        if(attendee.status === "checked-in") return res.status(208).json({ message: `Asistente ya registrado a las ${attendee.scanTime.getHours()}:${attendee.scanTime.getMinutes()}` });

        // check if the client eventId is a event of the organizer (client.eventId and user.organizerId)
        const event = await Event.findById(client.eventId);

        if( user.role !== "admin"){
            if(event.organizer.toString() != user.organizerId.toString()) return res.status(400).json({ message: 'Event not found' });
        }

        attendee.scanTime = new Date();
        attendee.status = "checked-in"
        await attendee.save()

        // You can now use user information, for example:
        console.log(`User ${user.username} scanned ticket for attendee ${attendee.name}`);

        res.status(200).json({ message: 'Ticket scanned successfully', attendee, scannedBy: user.username });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};