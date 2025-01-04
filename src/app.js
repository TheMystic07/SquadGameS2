import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import chatRoutes from "./routers/chatRoutes.js";
import userRoutes from "./routers/userRoutes.js";
import gameRoutes from "./routers/gameRoutes.js";

export const app = express();

config({ path: "./.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow *.vercel.app or localhost:5173
      if (
        process.env.NODE_ENV === "development" ||
        (origin &&
          (origin.match(/^https?:\/\/(.*\.)?vercel\.app$/) ||
            origin === "http://localhost:5173" ||
            origin === "http://localhost:3000"))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(cookieParser());

export const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/games", gameRoutes);

io.on("connection_error", console.error);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const lobby = "lobby";
  socket.join(lobby);
  console.log("User joined lobby:", socket.id);

  // Listen for public messages
  socket.on("publicMessage", (data) => {
    io.to(lobby).emit("publicMessage", data);
  });

  // Listen for private messages
  socket.on("privateMessage", (data) => {
    const { chatId, message } = data;
    io.to(chatId).emit("privateMessage", message);
  });

  // Listen for joining rooms
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.set("socketio", io);
