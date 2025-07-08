import jwt from "jsonwebtoken";
import cookie from "cookie";
import Message from "../models/Message.js";

function setupSocket(io) {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const cookiesHeader = socket.handshake?.headers?.cookie;
    const tokenCookie = cookiesHeader ? cookie.parse(cookiesHeader).token : null;

    if (tokenCookie) {
      jwt.verify(tokenCookie, process.env.JWT_SECRET, {}, (err, userData) => {
        if (err) return;

        socket.userId = userData.userId;
        socket.username = userData.username;
        onlineUsers.set(socket.id, {
          userId: socket.userId,
          username: socket.username,
        });

        broadcastOnlineUsers();
      });
    }

    socket.on("message", async (data) => {
      const { recipient, text } = data;

      if (recipient && text) {
        const messageDoc = await Message.create({
          sender: socket.userId,
          recipient,
          text,
        });

        for (let [id, user] of onlineUsers.entries()) {
          if (user.userId === recipient) {
            io.to(id).emit("message", messageDoc);
          }
        }
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers();
    });

    function broadcastOnlineUsers() {
      const users = Array.from(onlineUsers.values());
      io.emit("online", users);
    }
  });
}

export default setupSocket;
