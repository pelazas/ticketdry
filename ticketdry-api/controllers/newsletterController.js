const NewsletterEmail = require("../models/NewsletterEmail");

exports.addNewsletterEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const newsletterEmail = new NewsletterEmail({ email });
        await newsletterEmail.save();
        res.status(201).json({ message: "Email added to newsletter" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}