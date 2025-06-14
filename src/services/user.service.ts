import UserSchema from '../db_schema/users';
import User from '../models/user';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface UserServiceResult {
  success: boolean;
  message?: string;
  uuid?: string;
};


export class UserService {
  constructor() {

  }

  async regiserUser(user : User): Promise<UserServiceResult> {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password!, salt);
      const userCreate = await UserSchema.create({...user});
      return {
        success: true,
        message: "User registered successfully.",
        uuid: userCreate.uuid,
      };
    } catch (error) {
      console.error("Error registering user:", error);
      return {
        success: false,
        message: `An error occurred`,
      };
    }
  }

  async connectUser(user : User): Promise<UserServiceResult> {
    try{
      const currentUser = await UserSchema.findOne({ where: { email: user?.email } });
      if (!currentUser) {
        return {
          success: false,
        };
      }

      const isPasswordValid = await bcrypt.compare(user.password!, currentUser.password);
      if (!isPasswordValid) {
        return {
          success: false,
        };
      }

      return {
        success: true,
        uuid: currentUser.uuid,
      };
    }
    catch (error) {
      console.error("Error connecting user:", error);
      return {
        success: false,
      };
    }
  }

  async registerUserEsp32(uuidEsp32: string, uuidUser: string): Promise<UserServiceResult> {
    try{
      const user = await UserSchema.findOne({ where: { uuid: uuidUser } });
      if (!user) {
        return {
          success: false,
          message: "User not found.",
        };
      }
      user.lasers = Array.from(new Set([...(user.lasers || []), uuidEsp32]));
      await user?.save();
      return {
        success: true,
      }
    }
    catch (error) {
      console.error("Error registering ESP32:", error);
      return {
        success: false,
        message: `An error occurred while registering the ESP32.`,
      };
    }
  }
}

export default UserService;
