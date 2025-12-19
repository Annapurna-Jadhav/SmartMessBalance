import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const QR_SECRET = process.env.QR_SECRET;

if (!fs.existsSync("./receipts")) {
  fs.mkdirSync("./receipts");
}

async function generateReceipt(num) {
  const roll = `231CV20${num}`;
  const issuedAt = "2026-01-01";
  const issuedAtCompact = issuedAt.replace(/-/g, "");

  // ✅ UNIQUE, NORMALIZED RECEIPT ID
  const receiptId = `HOSTEL-2026-${roll}-${issuedAtCompact}`.toUpperCase();

  const payload = {
    roll,
    name: `STUDENT0${num}`,
    receiptId,
    issuedAt,
    validTill: "2026-04-30",
    initialCredits: 70000,
    email: `student0${num}.${roll}@nitk.edu.in`,
  };

  // 1️⃣ Sign QR token
  const qrToken = jwt.sign(payload, QR_SECRET, {
    expiresIn: "365d",
  });

  // 2️⃣ Generate QR image
  const qrImagePath = `./receipts/${roll}_receipt_qr.png`;
  await QRCode.toFile(qrImagePath, qrToken);

  console.log("✅ Receipt QR generated");
  console.log({
    receiptId,
    roll,
    email: payload.email,
  });
}

// 🔁 Generate multiple receipts
for (let num = 1; num < 10; num++) {
  await generateReceipt(num);
}
