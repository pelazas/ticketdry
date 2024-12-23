const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketdryDB';

    mongoose.connect(mongoUri, {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
};

module.exports = connectDB;
