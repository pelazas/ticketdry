const { s3, bucketName, randomImageName } = require('../config/s3');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const City = require('../models/City')
const Organizer = require('../models/Organizer');
require('dotenv').config();

exports.addCity = async (req, res) => {
    try {
        // if the user is not an admin, then the user can only create events for his own organizer
        if(req.user.role !== "admin" && req.user.organizerId !== req.body.organizerId) 
            return res.status(403).json({ message: 'Unauthorized' });

        const { name, municipality, isFeatured } = req.body;

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

        const city = new City({ name, municipality, photo: photoName, isFeatured, organizers: [] });
        await city.save();
        res.status(201).json({ message: 'City added successfully', city });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCitiesWithImages = async (req, res) => {
    try {
        const cities = await City.find();
        for(const city of cities){
            const getObjectParams = {
                Bucket: bucketName,
                Key: city.photo
            }
            const command = new GetObjectCommand(getObjectParams)
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            city.photo = photoUrl;
        }
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCitiesNoImages = async (req, res) => {
    try {
        const cities = await City.find();
        const response = cities.map(city => city.name);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getOrganizersByCityName = async (req, res) => {
    try {
        const cities = await City.find();
        const city = cities.find(city => 
            city.name.toLowerCase().replace(/\s+/g, '-') === req.params.cityName
        );

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        const organizers = await Organizer.find({ city: city._id });

        for(const organizer of organizers){
            const getObjectParams = {
                Bucket: bucketName,
                Key: organizer.profilePhoto
            }
            const command = new GetObjectCommand(getObjectParams)
            const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
            organizer.profilePhoto = photoUrl;
        }

        const response = {
            city: city.name,
            municipality: city.municipality,
            organizers: organizers
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}