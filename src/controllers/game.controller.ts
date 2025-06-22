import { Request, Response } from "express";
import GameService from "../services/game.service";
import { Server } from "socket.io";

class GameController {
  private readonly gameService: GameService;

  constructor(io: Server) {
    this.gameService = new GameService(io);
  }

  async startGame(req: Request, res: Response): Promise<void> {
    try {
      const players = req.body.players;
      const game = this.gameService.startGame(players);
      res.status(201).json(game);
    }
    catch (error) {
      res.status(500).json({ error: "Error during starting game" });
    }
  }

  async getGame(req: Request, res: Response): Promise<void> {
    try {
      const gameId = req.params.gameId;
      const game = this.gameService.getGame(gameId);
      res.status(200).json(game);
    }
    catch (error) {
      res.status(404).json({ error: "Game not found" });
    }
  }

  async getColorDetected(req: Request, res: Response): Promise<void> {
    try {
      const gameId = req.query.gameId;
      const color = await this.gameService.getColorDetected(gameId as string);
      res.status(200).json(color);
    }
    catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateColorDetected(req: Request, res: Response): Promise<void> {
    try {      
      const { id, hitColor } = req.body;
      
      if (id && hitColor) {
        const colorData = { hitColor };
        await this.gameService.updateColorDetectedGlobal(colorData);
      }
      else {
        res.status(400).json({ error: "Invalid Format" });
        return;
      }
      
      res.status(200).json({ message: "Color successfuly updated" });
    }
    catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async stopGame(req: Request, res: Response): Promise<void> {
    try {
      const gameId = req.body.gameId;
      await this.gameService.stopGame(gameId);
      res.status(200).json({ message: "Game stopped succesfully" });
    }
    catch (error) {
      res.status(500).json({ error: "Error during stopping game" });
    }
  }

  async addPlayer(req: Request, res: Response): Promise<void> {
    try {
      const { gameId, player } = req.body;
      const updatedGame = await this.gameService.addPlayer(gameId, player);
      res.status(200).json(updatedGame);
    }
    catch (error) {
      res.status(500).json({ error: "Error during adding player to the game" });
    }
  }

  async updateScore(req: Request, res: Response): Promise<void> {
    try {
      const { gameId, playerName, score } = req.body;
      const updatedGame = await this.gameService.updateScore(gameId, playerName, score);
      res.status(200).json(updatedGame);
    }
    catch (error) {
      res.status(500).json({ error: "Error during updating score" });
    }
  }
}

export default GameController;
