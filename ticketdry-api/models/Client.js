const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    recieveEmails: { type: Boolean, required: true, default: false },
    dateOfPurchase: { type: Date, default: null },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'Attendee', default: [] }]
});

module.exports = mongoose.model('Client', ClientSchema);
