
import admin from "../config/firebase.js";

import db from "../config/firestore.js"




async function seed() {
  const batch = db.batch();
  const now = new Date();

  for (let i = 1; i <= 10; i++) {
    const ref = db.collection("mess_applications").doc();

    /* ---------- OPERATION ---------- */
    const startDate = "2026-01-01";
    const endDate =
      i % 3 === 0 ? "2026-04-01" : "2026-05-15";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    /* ---------- PRICING (VARIED) ---------- */
    const prices = {
      breakfast: 40 + i * 5,  // 45 → 90
      lunch: 120 + i * 10,    // 130 → 220
      snacks: 30 + i * 5,     // 35 → 80
      dinner: 120 + i * 10,   // 130 → 220
      grandDinner: 180 + i * 10, // 190 → 280
    };

    const dailyBaseCost =
      prices.breakfast +
      prices.lunch +
      prices.snacks +
      prices.dinner;

    const estimatedCredits = dailyBaseCost * totalDays;

    /* ---------- PENALTY ---------- */
    const penaltyPercent =
      i % 4 === 0 ? 100 : i % 2 === 0 ? 75 : 50;

    /* ---------- GRAND DINNER CONFIG ---------- */
    const grandDinnerConfig =
      i % 3 === 0
        ? { replaces: "LUNCH_DINNER", timesPerMonth: 3 }
        : { daysPerMonth: 2 };

    batch.set(ref, {
      email: `mess${i}@gmail.com`,
      messName: `Mess ${i}`,
      campusType: i % 2 === 0 ? "GIRLS" : "BOYS",
      foodType: i % 3 === 0 ? "VEG" : "NON_VEG",

      prices,
      penaltyPercent,

      grandDinner: grandDinnerConfig,

      operation: {
        startDate,
        endDate,
        totalDays,
      },

      estimatedCredits,

      /* ---------- IMPORTANT ---------- */
      status: "PENDING_HOSTEL_APPROVAL",

      createdAt: now,
    });
  }

  await batch.commit();
  console.log("✅ Seeded 10 PENDING mess applications with varied pricing");
}

seed();


