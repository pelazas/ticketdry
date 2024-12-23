const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const organizerRoutes = require('./routes/organizer');
const eventRoutes = require('./routes/event');
const clientRoutes = require('./routes/client');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');
const newsletterRouter = require('./routes/newsletter');
const contactRouter = require('./routes/contact');
const cityRouter = require('./routes/city');
const app = express();
app.use(express.json());
app.use(cors())

// Connect to MongoDB
connectDB();

app.get('/', (req,res) => {
    res.send('Server is running');
})

// Routes
app.use('/organizer', organizerRoutes);
app.use('/event', eventRoutes);
app.use('/client', clientRoutes);
app.use('/user', userRouter);
app.use('/payment', paymentRouter);
app.use('/newsletter', newsletterRouter);
app.use('/contact', contactRouter);
app.use('/city', cityRouter);


app.use((error, req, res, next) => {
    const data = {
        Message: `${error.message ? error.message : ''}`,
        Code: `${error.code ? error.code : ''}`,
        Stacktrace: `${error.stack}`
    };
    res.status(500).json(data);
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

