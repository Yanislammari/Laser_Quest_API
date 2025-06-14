import express from "express";
import { Server } from "socket.io";
import GameController from "../controllers/game.controller";

const gameRoutes = (io: Server) => {
  const router = express.Router();
  const gameController = new GameController(io);

  router.get("/color", (req, res) => gameController.getColorDetected(req, res));
  router.post("/color", (req, res) => gameController.updateColorDetected(req, res));

  return router;
};

export default gameRoutes;

