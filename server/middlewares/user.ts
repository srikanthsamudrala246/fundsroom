import zod from 'zod'
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'


const nameSchema = zod.string().min(3);
const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(5);

 export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.body["username"];
  const email = req.body["email"];
  const password = req.body["password"];
  const nameResult = nameSchema.safeParse(username);
  const emailResult = emailSchema.safeParse(email);
  const passwordResult = passwordSchema.safeParse(password);

  if (nameResult.success && emailResult.success && passwordResult.success) {
    next();
  } else {
    next({ status: 400, success: false, error: "Invalid username or password" });
  }
};


 export const validateCredentials = (req:Request, res: Response, next: NextFunction) => {
    const email = req.body["email"];
    const password = req.body["password"];
    const emailResult = emailSchema.safeParse(email);
    const passwordResult = zod.string().min(1).safeParse(password);
    console.log()
    if (emailResult.success && passwordResult.success) {
      next();
    } else {
      next({ status: 400, success: false, error: "Invalid username or password" });
    }
  };
  
  export const fetchUser = (req:Request, res: Response, next:NextFunction) => {
    const token = req.header("auth-token");
    if (!token) {
      return res
        .status(400)
        .json({ error: "Please validate using valid auth token..." });
    }
    try {
      const data: any= jwt.verify(token, process.env.JWT_SECRET || "");
      req.body['user'] = data.user;
      next();
    } catch (error) {
      res.status(400).json({ error: "Please authenticate using valid token..." });
    }
  };
