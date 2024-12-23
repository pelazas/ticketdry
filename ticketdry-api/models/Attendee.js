const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendeeSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['paid', 'checked-in'], default: 'active' },
    scanTime: { type: Date, default: null },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    ticketNumber: { type: String, required: true }
})

module.exports = mongoose.model('Attendee', AttendeeSchema);