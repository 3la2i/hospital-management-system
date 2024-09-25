const socketIo = require('socket.io');
const pool = require('../backend/config/db');

const setupSocketIO = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ userId, doctorId }) => {
      const room = `${userId}-${doctorId}`;
      socket.join(room);
      console.log(`User ${userId} joined room with Doctor ${doctorId}`);
    });

    socket.on('sendMessage', async (data) => {
      const { sender_id, receiver_id, message } = data;
      try {
        const result = await pool.query(
          'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *',
          [sender_id, receiver_id, message]
        );
        const savedMessage = result.rows[0];
        const room = `${sender_id}-${receiver_id}`;
        io.to(room).emit('message', savedMessage);
      } catch (error) {
        console.error('Error saving and broadcasting message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = setupSocketIO;