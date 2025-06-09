import server from "./src/app";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server Running : ${PORT}`);
});
