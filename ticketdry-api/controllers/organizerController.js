const Organizer = require('../models/Organizer');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3,bucketName, randomImageName } = require('../config/s3');
const Event = require('../models/Event');
const City = require('../models/City');
exports.createOrganizer = async (req, res) => {
    try {
        if(req.user.role !== 'admin'){
            return res.status(403).json({ message: 'You are not authorized to create an organizer' });
        }
        // upload profile picture
        const extension = req.files.profilePhoto[0].mimetype.split('/')[1]; 
        const profilePhotoName = randomImageName(32, extension);
        const profilePhotoCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: profilePhotoName,
            Body: req.files.profilePhoto[0].buffer,
            ContentType: req.files.profilePhoto[0].mimetype
        })
        await s3.send(profilePhotoCommand)
        console.log(profilePhotoName, "saved correctly!")
        
        // upload rest of pictures
        const imageNames = [];
        if(req.files.photos){
            for(const file of req.files.photos){
                const extension = file.mimetype.split('/')[1]; 
                const imageName = randomImageName(32, extension);
                const imageCommand = new PutObjectCommand({
                    Bucket: bucketName,
                    Key: imageName,
                    Body: file.buffer,
                    ContentType: file.mimetype
                })
                await s3.send(imageCommand)
                console.log(imageName, "saved correctly!")
                imageNames.push(imageName)
            }
        }

        const city = await City.findOne({ name: req.body.city });

        // save in database
        const organizer = new Organizer({
            name: req.body.name,
            profilePhoto: profilePhotoName,
            description: req.body.description,
            email: req.body.email,
            photos: imageNames,
            city: city._id
        });
        const savedOrganizer = await organizer.save();

        res.send(savedOrganizer);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
};

exports.getAllOrganizers = async (req, res) => {
    try {
        const organizers = await Organizer.find();
        const response = []
        let i = 0;
        for(const org of organizers){
            response[i] = {};
            response[i].name = org.name;
            response[i].description = org.description;
            response[i].email = org.email;
            response[i]._id = org._id;

            const getObjectParams = {
                Bucket: bucketName,
                Key: org.profilePhoto
            }
            const command = new GetObjectCommand(getObjectParams)
            const profilePhotoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            response[i].profilePhoto = profilePhotoUrl;

            const events = await Event.find({ organizer: org._id, status: 'active' });
            response[i].minPrice = Math.min(...events.map(event => event.price));

            i++;
        }

        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrganizer = async (req, res) => {
    try {
        const organizerId = req.params.organizerId;
        const organizer = await Organizer.findById(organizerId);

        if (!organizer) {
            return res.status(404).json({ message: 'Organizer not found' });
        }

        const response = {
            name: organizer.name,
            description: organizer.description,
            email: organizer.email
        };

        // Get signed URL for profile photo
        const profilePhotoParams = {
            Bucket: bucketName,
            Key: organizer.profilePhoto
        };
        const profilePhotoCommand = new GetObjectCommand(profilePhotoParams);
        const profilePhotoUrl = await getSignedUrl(s3, profilePhotoCommand, { expiresIn: 3600 });
        response.profilePhoto = profilePhotoUrl;

        // Get signed URLs for all photos
        response.photos = [];
        for (const photo of organizer.photos) {
            const photoParams = {
                Bucket: bucketName,
                Key: photo
            };
            const photoCommand = new GetObjectCommand(photoParams);
            const photoUrl = await getSignedUrl(s3, photoCommand, { expiresIn: 3600 });
            response.photos.push(photoUrl);
        }

        // get events of the organizer
        const events = await Event.find({ organizer: organizerId });
        response.events = events;

        // get the photo of the event
        let i = 0;
        for(const event of response.events){
            const getObjectParams = {
                Bucket: bucketName,
                Key: event.photo
            }
            const command = new GetObjectCommand(getObjectParams)
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            response.events[i].photo = photoUrl;
            i++;
        }

        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

