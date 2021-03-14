import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";

class AuthController{
  static login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    if(!(username && password)){
      return res.status(400).json({message: 'Username & password are required'})
    }
    const userRepository = getRepository(User);
    let user : User;

    try {
      user = await userRepository.findOneOrFail({where: {username}})
    } catch (error) {
      return res.status(400).json({message:'Username or password incorrect!'})
    }

    // check password
    if(!user.checkPassword(password)){
      return res.status(400).json({message: 'Usernem or Password are incorrect'});
    }

    const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret,
      {expiresIn: '1h'})
    res.send({menssge: 'OK', token});
  }

  static changePassword = async (req: Request, res: Response) => {
    const {userId} = res.locals.jwtPayload;
    const {oldPassword, newPassword} = req.body;

    if(!(oldPassword && newPassword)){
      res.status(400).json({message: 'Old password & new password are required'})
    }

    const userRepository = getRepository(User)
    let user: User;

    try {
      user = await userRepository.findOneOrFail(userId)
    } catch (error) {
      res.status(400).json({message: 'Somenthing goes wrong!'})
    }
    if(!user.checkPassword(oldPassword)){
      return res.status(401).json({message: 'Check your old Password'})
    }

    user.password = newPassword;
    const validationOps = {validationError: {target: false, value: false}};
    const errors = await validate(user, validationOps)

    if(errors.length > 0 ){
      return res.status(400).json(errors)
    }
    //has password
    user.hashPassword();
    userRepository.save(user);

    res.json({message: 'Password change!'})
  }
}

export default AuthController