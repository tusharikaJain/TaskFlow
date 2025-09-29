require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// Optional Socket.IO setup
// const { Server } = require('socket.io');
// const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || '*' } });
// io.on('connection', socket => {
//   console.log('a user connected', socket.id);
//   socket.on('disconnect', () => console.log('user disconnected', socket.id));
// });

connectDB(process.env.MONGO_URI);

app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('TaskFlow API is running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
