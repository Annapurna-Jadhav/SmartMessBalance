import express from "express";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
import { verifyReceipt, getStudentProfile } from "../controllers/student.controllers.js";
import { upload } from "../middleware/upload.middleware.js";
import { selectMess } from "../controllers/student.controllers.js";
router.post(
  "/verify",
 authMiddleware,
  upload.single("receiptImage"),
  verifyReceipt
);

router.get("/me", authMiddleware, getStudentProfile);
router.post("/select-mess", authMiddleware, selectMess);

export default router;
