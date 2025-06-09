import { Express } from "express";
import { Server } from "socket.io";
import GameService from "../services/game.service";

export default function initSockets(app: Express): { server: any; io: Server } {
  const server = require("http").createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const gameService = new GameService(io);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    gameService.setupSocketListeners(socket);
  });

  return { server, io };
}
