const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizerSchema = new Schema({
    name: { type: String, required: true },
    photos: {type: [String], default: []},
    profilePhoto: String,
    description: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City' }
});

module.exports = mongoose.model('Organizer', OrganizerSchema);
