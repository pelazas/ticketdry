const nodeMailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log(req.body)
        const emailContent = `
            <h1>Contact Form Submission</h1>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        `;

        const transporter = nodeMailer.createTransport({
            host: 'smtp-es.securemail.pro',
            port: 465,
            secure: true,
            auth: {
                user: 'entradas@ticketdry.com',
                pass: 'tetillaS123$69'
            }
        })

        const info = await transporter.sendMail({
            from: '"TicketDRY" <entradas@ticketdry.com>',
            to: `ticketdry1@gmail.com, ${email}`,
            subject: 'Contact Form Submission',
            html: emailContent
        })

        console.log("Contact form received!", info.messageId)

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};

