const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    name: { type: String, required: true },
    dateOfEvent: { type: Date, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
    price: { type: Number, required: true },
    commission: { type: Number, required: true },
    photo: { type: String },
    limitDateToBuy: { type: Date, required: true },
    maxNOfPeople: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featured: { type: Boolean, default: false },
    clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
    location: { type: String, required: true },
});

module.exports = mongoose.model('Event', EventSchema);
