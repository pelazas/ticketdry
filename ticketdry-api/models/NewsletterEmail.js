const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsletterEmailSchema = new Schema({
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NewsletterEmail', NewsletterEmailSchema);
