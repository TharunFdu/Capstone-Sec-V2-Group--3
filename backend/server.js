const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const PORT = process.env.PORT || 5001;
const sequelize = require('./config/db');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');
const venueRoutes = require('./routes/venueRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const chatSocket = require('./sockets/chatSocket');  
const profileRoutes = require('./routes/profile');
const recommendationRoutes = require('./routes/recommendationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const ChatGroup = require('./models/ChatGroup');
const ChatMessage = require('./models/ChatMessage');
const ChatGroupMember = require('./models/ChatGroupMember');
const User = require('./models/User');
const Event = require('./models/Event');
const Review = require('./models/Review');

const { ensureMainAdmin } = require('./controllers/authController');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());
app.use(passport.initialize());


sequelize.sync({ alter: true }).then(ensureMainAdmin);

app.use('/uploads', express.static('uploads'));

app.use('/api/recommendations', recommendationRoutes);
app.use('/api', reviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  chatSocket(io, socket);  

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
