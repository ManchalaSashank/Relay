import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (connection, req) => {
    function notifyAboutOnlinePeople() {
      const onlineUsers = [...wss.clients].map((c) => ({
        userId: c.userId,
        username: c.username,
      }));

      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ online: onlineUsers }));
      });
    }

    connection.isAlive = true;
    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        clearInterval(connection.timer);
        connection.terminate();
        notifyAboutOnlinePeople();
      }, 1000);
    }, 5000);

    connection.on("pong", () => {
      clearTimeout(connection.deathTimer);
    });

    const cookies = req.headers.cookie;

    if (cookies) {
      const tokenCookie = cookies
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];
        if (token) {
          jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
            if (err) return;
            connection.userId = userData.userId;
            connection.username = userData.username;
          });
        }
      }
    }

    notifyAboutOnlinePeople();

    connection.on("message", async (message) => {
      const { recipient, text } = JSON.parse(message.toString());

      if (recipient && text) {
        const messageDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
        });

        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) => {
            c.send(JSON.stringify(messageDoc));
          });
      }
    });
  });

  wss.on("close", () => {
    console.log("WebSocket closed");
  });
}

export default setupWebSocket;
