import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivity = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user_connected", (userId) => {
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);

      userSockets.set(userId, socket.id);
      userActivity.set(userId, "Idle");

      io.emit("user_online", [...userSockets.keys()]);

      socket.emit("user_online", [...userSockets.keys()]);
      io.emit("Activities", Array.from(userActivity.entries()));
    });

    socket.on("updateActivity", (userId, activity) => {
      userActivity.set(userId, activity);
      io.emit("Activities", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        console.log(`Message from ${senderId} to ${receiverId}:`, content);

        const receiverSocketId = userSockets.get(receiverId);
        if (!receiverSocketId) {
          console.log(`User ${receiverId} is not online`);
          return;
        }

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        io.to(receiverSocketId).emit("receive_message", message);
        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error.message);
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
        console.log(`User ${disconnectedUserId} disconnected`);
        io.emit("user_disconnected", disconnectedUserId);
        io.emit("user_online", [...userSockets.keys()]);
      }
    });
  });
};
