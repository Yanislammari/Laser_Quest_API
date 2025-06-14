import express from "express";
import UserController from "../controllers/user.controller";
import { createVerifyTokenMiddleware } from "../middleware/token";

const userRoutes = () => {
  const router = express.Router();
  const userController = new UserController();

  router.post("/connect", (req, res) => userController.connectUser(req, res));
  router.post("/register", (req, res) => userController.registerUser(req, res));
  router.post("/uuid_esp32", (req, res) => userController.registerUserEsp32(req, res));
  router.get("/lasers",createVerifyTokenMiddleware(),(req, res) => userController.getLasers(req, res));

  return router;
};

export default userRoutes;