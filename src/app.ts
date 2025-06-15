import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.routes";
import initSockets from "./config/sockets";
import userRoutes from "./routes/user.routes";
import { initClientMqtt } from "./config/brokerMqtt";

const app = express();
const { server, io } = initSockets(app);
initClientMqtt();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

app.use("/game", gameRoutes(io));
app.use("/user",userRoutes());

app.get('/', (_req, res) => {
    res.json({ message: 'The API is working' });
});

app.use((_req, res) => {
    res.status(404).json({ message: 'This route does not exist' });
});

export default server;
