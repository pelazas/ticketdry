const puppeteer = require('puppeteer');
const path = require('path');
const convertDateString = require('./convertDateString');
const fs = require('fs');
const { bucketName, s3 } = require('../config/s3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function generatePdf(qrCodeURL, event, organizer, attendee){
    try {
        console.log("Generating PDF");

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH // Use the environment variable set in Dockerfile
        });

        const page = await browser.newPage();
        const eventDate = convertDateString(event.dateOfEvent);
        const purchaseDate = convertDateString(new Date());

        const getObjectParams = {
            Bucket: bucketName,
            Key: event.photo
        }
        const command = new GetObjectCommand(getObjectParams)
        const photoUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })

        const logoPath = path.join(__dirname, 'media', 'LogoTDLanding.png');
        const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });

        const html = `
            <html lang="es">
<head>
<style>
    body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        background-color: white;
    }

    .ticket-container {
        width: 800px;
        padding: 40px;
        font-family: Arial, sans-serif;
        position: relative;
        margin: 0 auto;
        box-sizing: border-box;
    }
    
    .ticket-header {
        margin-bottom: 20px;
        text-align: center;
    }
    
    .company-logo {
        font-size: 24px;
        font-weight: bold;
        color: #1a237e;
    }
    
    .qr-code {
        width: 150px;
        height: 150px;
        display: block;
        margin: 20px auto;
    }
    
    .event-image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
    
    .event-image {
        width: 80%;
        height: 200px;
        object-fit: cover;
    }
    
    .ticket-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .detail-item {
        margin-bottom: 10px;
    }
    
    .label {
        font-weight: bold;
        color: #1a237e;
        font-size: 12px;
        text-transform: uppercase;
    }
    
    .value {
        font-size: 16px;
        color: #333;
    }
    
    .rules {
        background-color: #f5f5f5;
        padding: 15px;
        margin-top: 20px;
        font-size: 14px;
    }
    
    .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #666;
    }

    .ticket-number {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 12px;
        color: #999;
    }
</style>
</head>
<body>
    <div class="ticket-container">
        <div class="ticket-number">#${attendee.ticketNumber}</div>
        
        <div class="ticket-header">
            <div class="company-logo">
                <img src="data:image/png;base64,${logoBase64}" alt="TICKETDRY Logo" style="width: 80%; max-width: 200px;">
            </div>
        </div>

        <div class="event-image-container">
            <img class="event-image" src="${photoUrl}" alt="Imagen del Evento">
        </div>
        <img class="qr-code" src="${qrCodeURL}" alt="Código QR">

        <div class="ticket-details">
            <div class="detail-item">
                <div class="label">Nombre del Evento</div>
                <div class="value">${event.name}</div>
            </div>
            <div class="detail-item">
                <div class="label">Fecha del Evento</div>
                <div class="value">${eventDate}</div>
            </div>
            <div class="detail-item">
                <div class="label">Organizador</div>
                <div class="value">${organizer.name}</div>
            </div>
            <div class="detail-item">
                <div class="label">Asistente</div>
                <div class="value">${attendee.name}</div>
            </div>
            <div class="detail-item">
                <div class="label">Ubicación</div>
                <div class="value">${event.location}</div>
            </div>
            <div class="detail-item">
                <div class="label">Fecha de Compra</div>
                <div class="value">${purchaseDate}</div>
            </div>
        </div>

        <div class="rules">
            <h3>Reglas y Directrices del Evento</h3>
            <p>Para una experiencia agradable, por favor llegue al menos 30 minutos antes de la hora de inicio del evento. Se requiere una identificación con foto válida que coincida con el nombre en el boleto para ingresar. No se permitirá la entrada después de que el evento haya comenzado.</p>
            
            <p>Artículos prohibidos incluyen: alimentos y bebidas del exterior, cámaras profesionales, equipos de grabación y bolsos o mochilas grandes. Se permiten carteras pequeñas y bolsos transparentes, pero pueden estar sujetos a inspección de seguridad.</p>
            
            <p>Este boleto no es transferible ni reembolsable. Cualquier intento de duplicar o falsificar este boleto resultará en la denegación de entrada y posibles acciones legales. Al usar este boleto, usted acepta cumplir con todas las reglas y regulaciones del lugar.</p>
        </div>

        <div class="footer">
            Para cualquier pregunta o asistencia, contáctenos en info@ticketdry.com
        </div>
    </div>
</body>
</html>
        `;

        await page.setContent(html);
        await page.emulateMediaType('screen');
        const pdfDir = path.join(__dirname, 'pdfs');

        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }

        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const pdfTitle = `Entrada_${event.name}_${attendee.name}_${uniqueId}`;
        const pdfPath = path.join(pdfDir, `${pdfTitle}.pdf`);
        console.log("PDF PATH", pdfPath);

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            title: pdfTitle,  // Set the title of the PDF
        });
        console.log('PDF GENERATED');
        await browser.close();
        
        return { path: pdfPath, filename: pdfTitle };
    } catch (e) {
        console.log(e);
    }
}

module.exports = generatePdf;
