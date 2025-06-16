import express from "express";
import UserController from "../controllers/user.controller";
import { createVerifyTokenMiddleware } from "../middleware/token";
import rateLimit from 'express-rate-limit';

const lasersRateLimiter = rateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 100, // limit each IP to 10 requests per windowMs
  message: "Too many requests to /lasers, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const userRoutes = () => {
  const router = express.Router();
  const userController = new UserController();

  router.post("/connect", (req, res) => userController.connectUser(req, res));
  router.post("/register", (req, res) => userController.registerUser(req, res));
  router.post("/uuid_esp32", (req, res) => userController.registerUserEsp32(req, res));
  router.get("/lasers",lasersRateLimiter,createVerifyTokenMiddleware(),(req, res) => userController.getLasers(req, res));

  return router;
};

export default userRoutes;