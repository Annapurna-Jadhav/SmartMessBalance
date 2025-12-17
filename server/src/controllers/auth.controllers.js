import admin from "../config/firebase.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const db = admin.firestore();

export const continueAuth = asyncHandler(async (req, res) => {
  const { uid, email } = req.user;

 
  if (!uid || !email) {
    throw new ApiError(401, "Invalid authentication token");
  }

  if (!email.endsWith("@nitk.edu.in")) {

    return res
      .status(403)
      .json(
        new ApiResponse({
          statusCode: 403,
          message: "Only NITK institute emails are allowed",
        })
      );
  }

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();

  let role = "student";

  if (email === "hosteloffice@nitk.edu.in") {
    role = "hostel_admin";
  }

  if (!userSnap.exists) {
    await userRef.set({
      uid,
      email,
      role,
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
 
    await userRef.update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    role = userSnap.data().role;
  }

  return res
    .status(200)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "Authentication successful",
        data: { uid, email, role },
      })
    );
});
