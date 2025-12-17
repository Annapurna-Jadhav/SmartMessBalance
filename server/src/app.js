import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
export const app=express();
import cookieParser from "cookie-parser";





app.use(cors({
  origin:process.env.FRONTEND_URL||"http://localhost:5174", 
  credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],             
}));

app.use(express.json({
    limit: process.env.LIMIT

}))
app.use(express.urlencoded({
    limit: process.env.LIMIT,
    extended: true
}))
app.use(cookieParser());



app.use((req, res, next) => {
  console.log("🔸 Incoming Request Headers:", req.headers);
  next();
});

// pages 
import userRoutes from "./routes/user.js";
app.use("/api/v1/user",userRoutes);




app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: err.data || null,
    errorName: err.errorName || "ApiError",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});
