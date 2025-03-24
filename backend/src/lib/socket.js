import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivity = new Map();

  io.on("connection", (socket) => {
    socket.on("User Connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivity.set(userId, "Idle");

      io.emit("User Connected", userId);

      socket.emit("User Online", Array.from(userSockets.keys()));

      io.emit("Activities", Array.from(userActivity.entries()));
    });
    socket.on("updateActivity", (userId, activity) => {
      userActivity.set(userId, activity);
      io.emit("Activities", { userId, activity });
    });

    socket.on("send message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive message", message);
        }

        socket.emit("message sent", message);
      } catch (error) {
        socket.emit("message error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;

      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivity.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("User Disconnected", disconnectedUserId);
      }
    });
  });
};
