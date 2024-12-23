# TICKETDRY

This repository contains a fullstack application:

1. **ticketdry-landing** - Built with Next.js, this application provides a user-friendly interface for customers to browse and purchase event tickets.
2. **qr-reader-ticketdry** - Also built with Next.js, this application serves as a management tool for event organizers to create, edit, and manage events efficiently.
3. **ticketdry-api** - Built with Express.js, the backend handles all necessary API requests and integrations to support the frontend applications.

## Features

### General Features
- **Payment Integration with Stripe**: Secure and seamless payment processing for ticket purchases.
- **QR Code Generation**: Automatically generates QR codes for each ticket.
- **Ticket Generation with Puppeteer**: Creates PDF tickets dynamically for customers.
- **Email Notifications with Nodemailer**: Sends transactional emails to customers and organizers.
- **Authentication with JSON Web Tokens (JWT)**: Secure user authentication and authorization.

### Infrastructure
- **Cloudflare**: Used for CDN, caching, and enhanced security.
- **Nginx**: Acts as a reverse proxy for efficient request handling.
- **AWS S3 Bucket**: Stores and manages images securely.
- **MongoDB Database**: Manages event, user, and ticket data.

### Frontend Features
- **Next.js Framework**: High-performance, SEO-optimized React applications.
- **Tailwind CSS**: Rapid UI development with customizable utility-first CSS.

### Additional Features
- **Role-Based Management**: Differentiates functionalities for customers and event organizers.
- **Responsive Design**: Ensures seamless user experience across devices.
- **Scalable Architecture**: Designed to handle high traffic efficiently.