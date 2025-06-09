import { Server, Socket } from "socket.io";
import Color from "../models/color";

class GameService {
  private readonly io: Server;
  private lastColorReading: Color | null = null;

  constructor(io: Server) {
    this.io = io;
    console.log("GameService initialisé");
  }

  async getColorDetected(): Promise<Color> {
    if (!this.lastColorReading) {
      throw new Error("Aucune couleur détectée");
    }
    return this.lastColorReading;
  }

  async updateColorDetected(colorData: Color): Promise<void> {
    console.log("Nouvelle couleur reçue dans le service:", colorData);
    this.lastColorReading = {
      ...colorData,
      timestamp: new Date().toISOString()
    };
    console.log("Émission de l'événement colorUpdate avec les données:", this.lastColorReading);
    this.io.emit("colorUpdate", this.lastColorReading);
  }

  setupSocketListeners(socket: Socket): void {
    console.log("Configuration des listeners pour le socket:", socket.id);
    socket.on("colorDetected", (color: Color) => {
      console.log("Événement colorDetected reçu du socket:", color);
      this.updateColorDetected(color);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  }
}

export default GameService;
