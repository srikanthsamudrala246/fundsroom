import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { validateCredentials, validateUser } from "../middlewares/user";
import { prisma } from "../db";

dotenv.config();

const router = express.Router();
router.post("/signup", validateUser, async (req, res) => {
  let success = false;
  const email = req.body.email;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      res.status(400).json({ success, error: "User already exists..." });
    } else {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      const userDetails = await prisma.user.create({
        data: {
          email: email,
          password: secPass,
          username: req.body.username,
        },
        select: {
          userId: true,
        },
      });

      const secret = process.env.JWT_SECRET || ""

      const data = {
        user: {
          id: userDetails.userId,
        },
      };
      const authToken = jwt.sign(data, secret);

      success = true;
      res.status(200).json({ success, authToken });
    }
  } catch (error) {
    success = false;
    return res.status(500).json({ success, error: "Internal server error..." });
  }
});

router.post('/login',validateCredentials, async(req, res) => {
  let success = false;
  const {email, password} = req.body;
  try {
    const userDetails = await prisma.user.findUnique({
       where: {
        email: email
       },
       select: {
         username: true, 
         password: true,
         userId: true
       }
    });

    if(!userDetails){
      return res.status(400).json({success, error: "Invalid username or password..."});
    }
    const match = await bcrypt.compare(password, userDetails.password);
    if(!match){
      return res.status(400).json({success, error: "Invalid username or password..."})
    }
   
    const secret = process.env.JWT_SECRET || ""

      const data = {
        user: {
          id: userDetails.userId,
        },
      };
      const authToken = jwt.sign(data, secret);
      success = true;
      const username = userDetails.username
      res.status(200).json({ success, authToken, username });
  } catch (error) {
     success = false;
     return res.status(500).json({success, error: "Internal server error..."})
  }
})


module.exports = router;
