import { Request, Response } from "express";
import GameService from "../services/game.service";
import { Server } from "socket.io";
import Color from "../models/color";

class GameController {
  private readonly gameService: GameService;

  constructor(io: Server) {
    this.gameService = new GameService(io);
    console.log("GameController initialisé");
  }

  async getColorDetected(req: Request, res: Response): Promise<void> {
    try {
      const color = await this.gameService.getColorDetected();
      res.status(200).json(color);
    }
    catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateColorDetected(req: Request, res: Response): Promise<void> {
    try {
      console.log("Requête POST /color reçue avec les données:", req.body);
      const colorData: Color = req.body;
      await this.gameService.updateColorDetected(colorData);
      res.status(200).json({ message: "Couleur mise à jour avec succès" });
    }
    catch (error) {
      console.error("Erreur lors de la mise à jour de la couleur:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default GameController;
