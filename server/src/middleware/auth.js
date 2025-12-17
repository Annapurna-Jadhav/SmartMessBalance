import admin from '../config/firebase.js';
const ALLOWED_DOMAIN = "nitk.edu.in";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const email = decodedToken.email;
    if (!email || !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return res.status(403).json({
        message: "Access restricted to institute email accounts",
      });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
