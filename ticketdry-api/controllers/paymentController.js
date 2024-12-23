const Stripe = require('stripe')
require('dotenv').config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Event = require('../models/Event');
const Organizer = require('../models/Organizer');
const Client = require('../models/Client');
const convertDateString = require('../util/convertDateString');
const fs = require('fs');
const QRCode = require('qrcode');
const generatePdf = require('../util/generatePdf'); // Import your PDF generation utility
const sendEmail = require('../util/sendEmail'); // Import your email service
const Attendee = require('../models/Attendee');
const generateTicketNumber = require('../util/generateTicketNumber');

exports.processPaymentAndAddClient = async (req, res) => {
  try {
    console.log("PROCESSING PAYMENT")
    const { name, surname, email, eventId, phone, newsletter, amount, currency, attendeesNames } = req.body;

    // Get the event and organizer data
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const organizer = await Organizer.findById(event.organizer);
    if (!organizer) {
      throw new Error('Organizer not found');
    }

    // Process the payment with Stripe
    const amountInCents = currency === "eur" ? amount * 100 : amount;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
    });

    
    // Create and save the client data
    const client = new Client({
      name, 
      surname, 
      email, 
      eventId, 
      phone, 
      recieveEmails: newsletter == "on" ? true : false, 
      status: 'paid',
      dateOfPurchase: new Date()
    });

    await client.save();

    // Create attendees and add them to the client
    const attendees = [];
    for (let i = 0; i < attendeesNames.length; i++) {
      const attendee = new Attendee({
        name: attendeesNames[i],
        status: 'paid',
        clientId: client._id,
        ticketNumber: generateTicketNumber()
      });
      await attendee.save();
      attendees.push(attendee._id);
    }

    // Update client with attendees
    client.attendees = attendees;
    await client.save();

    // Add the client to the event
    event.clients.push(client._id);
    await event.save();

    const pathNames = [];
    const filenameNames = [];
    for(let i = 0; i < attendeesNames.length; i++) {
      // format the attendeesNames to remove spaces to _ and lowercase
      const formattedAttendeeName = attendeesNames[i].replace(/ /g, '_').toLowerCase();
      const url = `${process.env.API_URL}/user/scanTicket?clientId=${client._id}&attendeeName=${formattedAttendeeName}`;
      const qrCodeURL = await new Promise((resolve, reject) => {
        QRCode.toDataURL(url, (err, url) => {
          if (err) reject(err);
          else resolve(url);
        });
      });
      const attendee = await Attendee.findOne({ name: attendeesNames[i], clientId: client._id });
      
      const { path, filename } = await generatePdf(qrCodeURL, event, organizer, attendee);
      pathNames.push(path);
      filenameNames.push(filename);
    }

    // Send confirmation email
    const eventDate = convertDateString(event.dateOfEvent);
    await sendEmail(email, pathNames, filenameNames, `${name} ${surname}`, event.name, eventDate, event.location);

    // delte the pdf file after sending the email
    for(let i = 0; i < pathNames.length; i++) {
      fs.unlinkSync(pathNames[i]);
    }
    // Return the client data along with the payment intent client secret
    res.status(201).json({
      client,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
