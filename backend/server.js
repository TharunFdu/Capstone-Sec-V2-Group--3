const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const sequelize = require('./config/db');  
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');
const venueRoutes = require('./routes/venueRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


app.use(express.json());
app.use(cors());

sequelize.sync()
  .then(() => console.log('MySQL Database connected and tables created'))
  .catch(err => console.error('Error connecting to MySQL:', err));

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);

app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);

app.use('/api/bookings', bookingRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

