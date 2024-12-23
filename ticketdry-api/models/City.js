const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    name: { type: String, required: true },
    municipality: { type: String, required: true },
    photo: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    organizers: [{ type: Schema.Types.ObjectId, ref: 'Organizer' }]
})

module.exports = mongoose.model('City', CitySchema);