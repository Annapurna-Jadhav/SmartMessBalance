import express from "express";
import authMiddleware from "../middleware/auth.js";
import { continueAuth } from "../controllers/auth.controllers.js";


const router = express.Router();



router.post("/continue", authMiddleware, (req, res, next) => {
 
  next();
}, continueAuth);








export default router;
