import server from "./src/app";
import dotenv from "dotenv";
import { startOfDatabase } from "./src/config/db";

dotenv.config();
const PORT = process.env.PORT;

startOfDatabase();

server.listen(PORT, () => {
  console.log(`Server Running : ${PORT}`);
});
