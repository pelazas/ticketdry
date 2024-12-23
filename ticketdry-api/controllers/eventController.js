const { s3, bucketName, randomImageName } = require('../config/s3');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const Event = require('../models/Event');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const Client = require('../models/Client');
const Attendee = require('../models/Attendee');

exports.createEvent = async (req, res) => {
    try {
        
        // if the user is not an admin, then the user can only create events for his own organizer
        if(req.user.role !== "admin" && req.user.organizerId !== req.body.organizerId) 
            return res.status(403).json({ message: 'Unauthorized' });

        const limitDateToBuy = new Date(req.body.limitDateToBuy);
        const dateOfEvent = new Date(req.body.dateOfEvent);

        const extension = req.file.mimetype.split('/')[1]; 
        const photoName = randomImageName(32, extension);

        const profilePhotoCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: photoName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        })
        await s3.send(profilePhotoCommand)
        console.log(photoName, "saved correctly!")

        const event = new Event({
            name: req.body.name,
            description: req.body.description,
            limitDateToBuy,
            maxNOfPeople: req.body.maxNOfPeople,
            organizer: req.body.organizerId,
            dateOfEvent,
            price: req.body.price,
            photo: photoName,
            commission: req.body.commission,
            featured: req.body.featured,
            location: req.body.location,
        });
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllEventsOfOrganizer = async (req, res) => {
    try {
        const organizerId = req.params.organizerId;
        const events = await Event.find({ organizer: organizerId, status: 'active' });
        let i = 0;
        for(const event of events){
            const getObjectParams = {
                Bucket: bucketName,
                Key: event.photo
            }
            const command = new GetObjectCommand(getObjectParams)
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            events[i].photo = photoUrl;
            i++;
        }

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFullEventById = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        let event = await Event.findById(eventId).lean(); // Use lean() to get a plain JavaScript object
        if (event) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: event.photo
            }
            const command = new GetObjectCommand(getObjectParams)
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            event.photo = photoUrl;

            console.log("event", event)
            // for every client in the event, get the name and the lastname from the clientId and add them to the event
            event.clientsFullInformation = []
            let i = 0;
            for(const clientId of event.clients){
                let client = await Client.findById(clientId);
                const attendeesFullInformation = []
                for(const attendeeId of client.attendees){
                    const attendee = await Attendee.findById(attendeeId);
                    console.log("attendee", attendee)
                    attendeesFullInformation.push(attendee);
                }
                client = {
                    ...client.toObject(),
                    attendeesFullInformation
                }
                delete client.attendees
                console.log("clientAddedAttendees", client)
                event.clientsFullInformation.push(client)
                i++;
            }
            delete event.clients
        } else {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if (event) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: event.photo
            }
            const command = new GetObjectCommand(getObjectParams)
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            event.photo = photoUrl;
        } else {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.editEventById = async (req, res) => {
    try {
        // if the user is not an admin, then the user can only edit events for his own organizer
        if(req.user.role !== "admin" && req.user.organizerId !== req.body.organizerId) 
            return res.status(403).json({ message: 'Unauthorized' });

        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if(!event) return res.status(404).json({ message: "Event not found" });

        if(req.body.name) event.name = req.body.name;
        if(req.body.description) event.description = req.body.description;
        if(req.body.limitDateToBuy) event.limitDateToBuy = new Date(req.body.limitDateToBuy);
        if(req.body.maxNOfPeople) event.maxNOfPeople = req.body.maxNOfPeople;
        if(req.body.dateOfEvent) event.dateOfEvent = new Date(req.body.dateOfEvent);
        if(req.body.price) event.price = req.body.price;
        if(req.body.featured) event.featured = req.body.featured;
        if(req.body.commission) event.commission = req.body.commission;
        if(req.body.status) event.status = req.body.status;
        if(req.body.location) event.location = req.body.location;
        
        if(req.file){
            const extension = req.file.mimetype.split('/')[1]; 
            const photoName = randomImageName(32, extension);
            const profilePhotoCommand = new PutObjectCommand({
                Bucket: bucketName,
                Key: photoName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            })
            await s3.send(profilePhotoCommand)
            event.photo = photoName;
        }

        await event.save();
        res.json(event);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.getAllFeaturedEvents = async (req, res) => {
    try {
        const featuredEvents = await Event.find({ featured: true, status: 'active' });
        
        const eventsWithSignedUrls = await Promise.all(featuredEvents.map(async (event) => {
            const getObjectParams = {
                Bucket: bucketName,
                Key: event.photo
            };
            const command = new GetObjectCommand(getObjectParams);
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            
            return {
                ...event.toObject(),
                photo: photoUrl
            };
        }));

        res.json(eventsWithSignedUrls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteEventById = async (req, res) => {
    try {
        // if the user is not an admin, then the user can only delete events for his own organizer
        if(req.user.role !== "admin" && req.user.organizerId !== req.body.organizerId) 
            return res.status(403).json({ message: 'Unauthorized' });

        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });
        await Event.findByIdAndDelete(eventId);
        res.status(204).json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'active' });
        
        for(const event of events){
            const getObjectParams = {
                Bucket: bucketName,
                Key: event.photo
            }
            const command = new GetObjectCommand(getObjectParams)
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            event.photo = photoUrl;
        }
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
