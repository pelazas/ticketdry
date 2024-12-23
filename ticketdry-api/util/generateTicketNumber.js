function generateTicketNumber() {
    const currentYear = new Date().getFullYear();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let hash = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex];
    }

    return `${currentYear}-${hash}`;
}

module.exports = generateTicketNumber;

