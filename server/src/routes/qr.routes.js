import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

import { generateMealQR,scanMealEntry } from "../controllers/qr.controllers.js";

const router = Router();


router.post("/generateMealQR", authMiddleware, generateMealQR);


router.post("/scanQR", authMiddleware, scanMealEntry);

export default router;
