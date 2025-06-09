import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.routes";
import initSockets from "./config/sockets";

const app = express();
const { server, io } = initSockets(app);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

app.use("/game", gameRoutes(io));

export default server;
