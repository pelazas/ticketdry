const Client = require('../models/Client')
const QRCode = require('qrcode');
const generatePdf = require('../util/generatePdf');
const Event = require('../models/Event');
const Organizer = require('../models/Organizer');
const sendEmail = require('../util/sendEmail');
require('dotenv').config();


exports.addClientToEvent = async (req, res) => {
    try {
        const { name, surname, email, eventId, phone, recieveEmails, status } = req.body;

        const event = await Event.findById(eventId);
        const organizer = await Organizer.findById(event.organizer);

        const client = new Client({
            name, 
            surname, 
            email, 
            eventId, 
            phone, 
            recieveEmails, 
            status,
            dateOfPurchase: new Date()
        });

        await client.save();

        const url = `${process.env.API_URL}/user/scanTicket/${client._id}`;
        
        // Use async/await with QRCode.toDataURL
        const qrCodeURL = await new Promise((resolve, reject) => {
            QRCode.toDataURL(url, (err, url) => {
                if (err) reject(err);
                else resolve(url);
            });
        });

        // add the client to the event
        event.clients.push(client._id)
        await event.save()

        // Generate PDF
        const { path, filename } = await generatePdf(qrCodeURL, name, surname, event, organizer);
        
        const recipientName = `${name} ${surname}`;
        const eventName = event.name;
        const eventDate = convertDateString(event.dateOfEvent);
        const eventLocation = event.location;
        
        // Send email
        await sendEmail(email, path, filename, recipientName, eventName, eventDate, eventLocation);

        res.status(201).json(client);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

function convertDateString(dateString){
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}