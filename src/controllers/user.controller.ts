import { Request, Response } from "express";
import {UserService, UserServiceResult} from "../services/user.service";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from '../config/tokenKey';
import { v4 as uuidv4 } from 'uuid';
import UserMQTTService from "../services/MQTT/userMQTT.service";

class UserController {
  private readonly userService: UserService;
  private readonly userMQTTService: UserMQTTService;

  constructor() {
    this.userService = new UserService();
    this.userMQTTService = new UserMQTTService();
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try{
      const user : User = req.body;
      if (!user.email || !user.password || !user.pseudo) {
        res.status(400).json({ error: "Email, password, and pseudo are required." });
        return;
      }
      const result : UserServiceResult = await this.userService.regiserUser(user);
      if(result.success){
        const token = jwt.sign({ uuid : result.uuid}, TOKEN_KEY, { expiresIn: '1h' })
        res.status(201).json({ message: "User registered successfully.", token: token });
      }
      else{
        res.status(500).json({ error: result?.message || "An error occurred while registering the user." });
      }
    }
    catch (error) {
      res.status(500).json({ error: "An error occurred while registering the user." });
    }
  }

  async connectUser(req: Request, res: Response): Promise<void> {
    try {
      const user : User = req.body;
      if (!user.email || !user.password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
      }
      const result : UserServiceResult = await this.userService.connectUser(user);
      if(result.success){
        const token = jwt.sign({ uuid : result.uuid}, TOKEN_KEY, { expiresIn: '1h' })
        res.status(200).json({ message: "User connected successfully.", token : token });
      }
      else{
        res.status(401).json({ error: "Invalid email or password." });
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred while connecting the user." });
    }
  }
  
  async registerUserEsp32(req: Request, res: Response): Promise<void> {
    try{
      const uuid = uuidv4();
      const decoded = jwt.verify(req.body.token, TOKEN_KEY) as { uuid: string };
      const result = await this.userService.registerUserEsp32(uuid, decoded.uuid);
      if(result.success){
        res.status(201).json({ uuid : uuid});
      }
      else{
        res.status(500).json({ error: "An error occurred while registering the user." });
      }
    }
    catch (error) {
      res.status(500).json({ error: "An error occurred while registering the user." });
    }
  }

  async getLasers(req: Request, res: Response): Promise<void> {
    try{
      const lasers : string[] = req.body.user.lasers || [];
      if (lasers.length === 0) {
        res.status(404).json({ message: "No lasers found for this user." });
        return;
      }
      res.status(200);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.write(`${JSON.stringify({lasers})}`);

      const topicBaseSub = "esp32/status/";
      const topicBasePub = "api/status/";
      this.userMQTTService.addListenerForFront(topicBaseSub,res, lasers);
      this.userMQTTService.sendCommandToListOfUuid(topicBasePub,lasers);

      res.on('close', () => {
        console.log("Connection closed, removing listeners.");
        res.end();
        this.userMQTTService.removeListenerForFront(topicBaseSub,res, lasers);
      });
    }
    catch (error) {
      res.status(500).json({ error: "An error occurred while retrieving lasers." });
    }
  }
}

export default UserController;
