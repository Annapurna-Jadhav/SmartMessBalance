import express from "express";
import authMiddleware from "../middleware/auth.js";
import { continueAuth } from "../controllers/auth.controllers.js";

const router = express.Router();


router.post("/continue", authMiddleware, continueAuth);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

export default router;
