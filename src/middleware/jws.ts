import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import * as jwt from "jsonwebtoken";


export const checkJwt = (req: Request, res: Response, next: NextFunction) => {

  console.log('REQ-->', req.headers)

  const token = <string>req.headers['auth'];
  let jwtPayload;
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return res.status(401).send({message: 'Not Authorized'});
  }

  const {userId, username} = jwtPayload;
  const newToken = jwt.sign({userId, username}, config.jwtSecret, {expiresIn: '1h'})

  res.setHeader('token', newToken)
  //call next
  next();
}