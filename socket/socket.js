const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // هبقا اغيرها بعنوان الفرونت ايند
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication Error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);

      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Authentication Error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    const { userId, role } = socket.user;

    let room = null;

    switch (role) {
      case "CUSTOMER":
        room = `user:${userId}`;
        break;

      case "RESTAURANT_OWNER":
        room = `restaurant:${userId}`;
        break;

      case "DRIVER":
        room = `driver:${userId}`;
        break;

      default:
        console.log("Invalid Role");
        socket.disconnect(true);
        return;
    }

    socket.join(room);

    console.log(`${socket.id} joined ${room}`);

    socket.on("disconnect", (reason) => {
      console.log(`Socket Disconnected: ${socket.id}`);
      console.log(`Reason: ${reason}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};
