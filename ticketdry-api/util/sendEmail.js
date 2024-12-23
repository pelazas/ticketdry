const nodeMailer = require('nodemailer');



async function sendEmail(email, pathNames, filenameNames, recipientName, eventName, eventDate, eventLocation){

    const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Entrada para el evento</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hola <strong>${recipientName}</strong>,</p>

            <p>¡Gracias por tu compra! Adjunto encontrarás tu entrada para <strong>${eventName}</strong>, que se celebrará el <strong>${eventDate}</strong> en <strong>${eventLocation}</strong>.</p>

            <p>No olvides llevar tu entrada el día del evento para garantizar un acceso rápido y sin problemas. Si tienes alguna pregunta, no dudes en contactarnos.</p>

            <p>¡Nos vemos pronto!</p>

            <p>Saludos,<br>
            <strong>Carlos Pelazas</strong><br>
            TicketDRY<br>
            info@ticketdry.com</p>
        </body>
        </html>
        `;
    console.log("Sending email...")
    
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
        to: email,
        bcc: 'carlospelazas@gmail.com, ticketdry1@gmail.com',
        subject: 'Entrada para el evento',
        html: html,
        attachments: pathNames.map((path, index) => ({
            filename: `${filenameNames[index]}.pdf`,
            path: `${path}`,
            cid: 'entradas@ticketdry.com'
        }))
    })

    console.log("Message sent!", info.messageId)
}


module.exports = sendEmail;