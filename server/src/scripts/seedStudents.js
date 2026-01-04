import admin from "../config/firebase.js";
import db from "../config/firestore.js";

const DOMAIN = "nitk.edu.in";
const MESS_ID = "A1mUzvxiP3ol3QDMu7O1";
const MESS_NAME = "Mess 6";

async function seedStudents() {
  for (let rollNum = 202; rollNum <= 230; rollNum++) {
    const roll = `231CV${rollNum}`;
    const studentIndex = rollNum - 200; // 🔑 KEY LOGIC

    const name = `student${studentIndex}`;
    const email = `${name}.${roll.toLowerCase()}@${DOMAIN}`;

    // 1️⃣ Create Firebase Auth user (REAL UID)
    const user = await admin.auth().createUser({
      email,
      emailVerified: true,
      password: "Test@1234", // only for demo
      displayName: name,
    });

    const uid = user.uid;

    // 2️⃣ Firestore student profile
    await db.collection("students").doc(uid).set({
      uid,
      role: "student",
      name,
      roll,
      email,

      receiptVerified: true,
      receiptId: `HOSTEL-2026-${roll}-20260101`,
      messSelected: true,

      initialCredits: 70000,
      estimatedCredits: 44590,

      selectedMess: {
        messId: MESS_ID,
        messName: MESS_NAME,
        foodType: "VEG",
        campusType: "GIRLS",
        penaltyPercent: 75,
        prices: {
          breakfast: 70,
          lunch: 180,
          snacks: 60,
          dinner: 180,
          grandDinner: 240,
        },
      },

      operation: {
        startDate: "2026-01-01",
        endDate: "2026-04-01",
        totalDays: 91,
      },

      validTill: "2026-04-30",
      issuedAt: "2026-01-01",
      selectedAt: new Date(),
      lastLoginAt: new Date(),
    });

    console.log(`✅ Seeded ${name} (${roll})`);
  }

  console.log("🎉 All 30 students created successfully");
}

seedStudents().catch(console.error);
