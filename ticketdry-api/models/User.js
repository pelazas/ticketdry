const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'organizer'], required: true },
    organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: false }
});

module.exports = mongoose.model('User', UserSchema);
