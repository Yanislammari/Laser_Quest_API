import express from "express";
import { Server } from "socket.io";
import GameController from "../controllers/game.controller";

const gameRoutes = (io: Server) => {
  const router = express.Router();
  const gameController = new GameController(io);

  router.post("/start-game", (req, res) => gameController.startGame(req, res));
  router.get("/get-game/:gameId", (req, res) => gameController.getGame(req, res));
  router.get("/color", (req, res) => gameController.getColorDetected(req, res));
  router.post("/color", (req, res) => gameController.updateColorDetected(req, res));
  router.post("/stop-game", (req, res) => gameController.stopGame(req, res));
  router.post("/add-player", (req, res) => gameController.addPlayer(req, res));
  router.post("/update-score", (req, res) => gameController.updateScore(req, res));

  return router;
};

export default gameRoutes;
