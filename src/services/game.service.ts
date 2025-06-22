import { Server, Socket } from "socket.io";
import Color from "../models/color";
import { v4 as uuidv4 } from "uuid";
import Game from "../models/game";
import Player from "../models/player";

class GameService {
  private readonly io: Server;
  private games: Map<string, Game> = new Map();
  private lastColorReadings: Map<string, Color | null> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  startGame(players: Player[]): Game {
    const id = uuidv4();
    const playersWithScore = players.map(player => ({ ...player, score: 0 }));
    const game: Game = { id, players: playersWithScore };
    this.games.set(id, game);
    return game;
  }

  getGame(gameId: string): Game {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    return game;
  }

  async getColorDetected(gameId: string): Promise<Color> {
    const color = this.lastColorReadings.get(gameId);
    if (!color) {
      throw new Error("No color detected");
    }
    return color;
  }

  async updateColorDetected(gameId: string, colorData: Color): Promise<void> {
    const color = {
      ...colorData,
      timestamp: new Date().toISOString()
    };
    this.lastColorReadings.set(gameId, color);
    this.io.to(gameId).emit("colorUpdate", color);
  }

  async updateColorDetectedGlobal(colorData: Color): Promise<void> {
    const color = {
      ...colorData,
      timestamp: new Date().toISOString()
    };
    this.io.emit("colorUpdate", color);
  }

  async stopGame(gameId: string): Promise<void> {
    if (!this.games.has(gameId)) {
      throw new Error("Game not found");
    }
    
    this.games.delete(gameId);
    this.lastColorReadings.delete(gameId);
    this.io.to(gameId).emit("gameStopped", { gameId });
  }

  async addPlayer(gameId: string, player: Player): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    const playerWithScore = { ...player, score: 0 };
    game.players.push(playerWithScore);
    this.games.set(gameId, game);
    this.io.to(gameId).emit("playerJoined", { gameId, player: playerWithScore });
    return game;
  }

  async updateScore(gameId: string, playerName: string, score: number): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    const player = game.players.find(p => p.name === playerName);
    if (!player) {
      throw new Error("Player not found");
    }
    
    player.score = score;
    this.games.set(gameId, game);
    this.io.to(gameId).emit("scoreUpdated", { gameId, playerName, score });
    return game;
  }

  setupSocketListeners(socket: Socket): void {
    socket.on("joinGame", (gameId: string) => {
      socket.join(gameId);
      socket.data.currentGameId = gameId;
      console.log(`Socket ${socket.id} a rejoint la room ${gameId}`);
    });
    
    socket.on("colorDetected", (data: any) => {      
      const color = {
        ...data,
        timestamp: new Date().toISOString()
      };
      this.io.emit("colorUpdate", color);
    });
    
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  }
}

export default GameService;
