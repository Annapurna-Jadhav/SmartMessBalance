// src/controllers/receipt.controller.js
import { extractRollFromEmail } from "../utils/extractRoll.js";
import { verifyQRToken } from "../services/qr.services.js";
import db from "../config/firestore.js";
import { scanQRFromImage } from "../utils/scanQRFromImage.js";
import  asyncHandler from "../utils/asyncHandler.js";
import  ApiResponse from "../utils/ApiResponse.js";
import  ApiError  from "../utils/ApiError.js";


export const verifyReceipt = asyncHandler(async (req, res) => {
  /* ================= AUTH ================= */
  if (!req.user || !req.user.uid || !req.user.email) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!req.file) {
    throw new ApiError(400, "Receipt image required");
  }

  const { uid, email } = req.user;

  /* ================= 1️⃣ SCAN & VERIFY QR ================= */
  const qrToken = await scanQRFromImage(req.file.buffer);
  const rawQrData = verifyQRToken(qrToken);

  const qrData = {
    receiptId: rawQrData.receiptId,
    name: rawQrData.name,
    roll: rawQrData.roll,
    issuedAt: rawQrData.issuedAt,
    validTill: rawQrData.validTill,
    initialCredits: Number(rawQrData.initialCredits),
  };

  if (
    !qrData.receiptId ||
    !qrData.name ||
    !qrData.roll ||
    !qrData.issuedAt ||
    !qrData.validTill ||
    Number.isNaN(qrData.initialCredits)
  ) {
    throw new ApiError(400, "Invalid receipt QR data");
  }

  /* ================= 2️⃣ IDENTITY CHECK ================= */
  const emailRoll = extractRollFromEmail(email);
  if (qrData.roll !== emailRoll) {
    throw new ApiError(403, "Receipt does not belong to you");
  }

  /* ================= 3️⃣ VALIDITY CHECK ================= */
  if (new Date(qrData.validTill) < new Date()) {
    throw new ApiError(400, "Receipt has expired");
  }

  const receiptRef = db
    .collection("receiptVerification")
    .doc(qrData.receiptId);

  const studentRef = db.collection("students").doc(uid);

  /* ================= 4️⃣ ATOMIC TRANSACTION ================= */
  await db.runTransaction(async (tx) => {
    /* ---------- A. CHECK STUDENT FIRST (IDEMPOTENT) ---------- */
    const studentSnap = await tx.get(studentRef);

    if (studentSnap.exists && studentSnap.data().receiptVerified) {
      // Student already verified → safe retry
      return;
    }

    /* ---------- B. CHECK RECEIPT USAGE ---------- */
    const receiptSnap = await tx.get(receiptRef);

    if (receiptSnap.exists) {
      const usedBy = receiptSnap.data().verifiedByUid;

      if (usedBy === uid) {
        // Same student retry → idempotent success
        return;
      }

      // Different student → block
      throw new ApiError(
        409,
        "Receipt already used by another student"
      );
    }

    /* ---------- C. SAVE RECEIPT ---------- */
    tx.set(receiptRef, {
      receiptId: qrData.receiptId,
      roll: qrData.roll,
      issuedAt: qrData.issuedAt,
      validTill: qrData.validTill,
      initialCredits: qrData.initialCredits,
      verifiedByUid: uid,
      verifiedAt: new Date(),
    });

    /* ---------- D. UPDATE STUDENT ---------- */
    tx.set(
      studentRef,
      {
        name: qrData.name,
        roll: qrData.roll,
        receiptId: qrData.receiptId,
        issuedAt: qrData.issuedAt,
        validTill: qrData.validTill,
        receiptVerified: true,
        messSelected: false,
        initialCredits: qrData.initialCredits,
      },
      { merge: true }
    );
  });

  /* ================= 5️⃣ RESPONSE ================= */
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Receipt verified successfully",
      data: {
        name: qrData.name,
        roll: qrData.roll,
        issuedAt: qrData.issuedAt,
        validTill: qrData.validTill,
        receiptVerified: true,
        initialCredits: qrData.initialCredits,
      },
    })
  );
});

// controllers/student.controller.js
export const getStudentProfile = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json(
      new ApiResponse({
        statusCode: 401,
        message: "Unauthorized",
      })
    );
  }

  const { uid } = req.user;

  const snap = await db.collection("students").doc(uid).get();

  if (!snap.exists) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Student profile not created yet",
        data: {
          role: "student",
          exists: false,
          receiptVerified: false,
          messSelected: false,
        },
      })
    );
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Student profile",
      data: {
        role: "student",
        exists: true,
        ...snap.data(),
      },
    })
  );
});
export const selectMess = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { messId } = req.body;

  if (!messId) {
    throw new ApiError(400, "Mess ID required");
  }

  const studentRef = db.collection("students").doc(uid);
  const messRef = db.collection("messes").doc(messId);

  await db.runTransaction(async (tx) => {
    /* ================= STUDENT ================= */
    const studentSnap = await tx.get(studentRef);
    if (!studentSnap.exists) {
      throw new ApiError(404, "Student not found");
    }

    const student = studentSnap.data();

    if (!student.receiptVerified) {
      throw new ApiError(403, "Receipt not verified");
    }

    if (student.messSelected) {
      throw new ApiError(409, "Mess already selected");
    }

    /* ================= MESS ================= */
    const messSnap = await tx.get(messRef);
    if (!messSnap.exists) {
      throw new ApiError(404, "Mess not found");
    }

    const mess = messSnap.data();

    if (!mess.isActive) {
      throw new ApiError(403, "Mess is inactive");
    }

    // Optional campus enforcement (enable later if needed)
    // if (mess.campusType !== "BOTH" && mess.campusType !== student.campusType) {
    //   throw new ApiError(403, "Campus not allowed");
    // }

    /* ================= VALIDATIONS ================= */
    if (student.initialCredits < mess.estimatedCredits) {
      throw new ApiError(403, "Insufficient credits");
    }

    if (new Date(student.validTill) < new Date(mess.operation.endDate)) {
      throw new ApiError(
        403,
        "Receipt validity is shorter than mess duration"
      );
    }

    /* ================= UPDATE STUDENT ================= */
    tx.update(studentRef, {
      messSelected: true,

      // Deduct credits
      initialCredits:
        student.initialCredits - mess.estimatedCredits,

      // Store FULL mess snapshot (UI friendly)
      selectedMess: {
        messId: messId,
        messName: mess.messName,
        campusType: mess.campusType,
        foodType: mess.foodType || "BOTH",

        prices: {
          breakfast: mess.prices.breakfast,
          lunch: mess.prices.lunch,
          snacks: mess.prices.snacks,
          dinner: mess.prices.dinner,
          grandDinner: mess.prices.grandDinner,
        },

        penaltyPercent: mess.penaltyPercent,
        estimatedCredits: mess.estimatedCredits,

        operation: {
          startDate: mess.operation.startDate,
          endDate: mess.operation.endDate,
          totalDays: mess.operation.totalDays,
        },

        selectedAt: new Date(),
      },
    });

    /* ================= UPDATE MESS ================= */
    tx.update(messRef, {
      studentCount: (mess.studentCount || 0) + 1,
    });
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Mess selected successfully",
    })
  );
});

