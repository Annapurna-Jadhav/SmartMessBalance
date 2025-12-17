import express from "express";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    role: "student", // temp (DAY 3 we fix this)
  });
});

export default router;
