const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;

const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');


connectDB();


app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});









