import admin from "../config/firebase.js";
import db from "../config/firestore.js";

const MEALS = ["breakfast", "lunch", "snacks", "dinner"];

async function seedSettlementFlags() {
  const snap = await db.collection("student_meal_days").get();

  if (snap.empty) {
    console.log("❌ No student_meal_days found");
    return;
  }

  let updatedCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const meals = data.meals;
    if (!meals) continue;

    const updates = {};

    for (const mealType of MEALS) {
      const meal = meals[mealType];
      if (!meal) continue;

      if (meal.settlementApplied === undefined) {
        updates[`meals.${mealType}.settlementApplied`] = false;
      }
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date();
      await doc.ref.update(updates);
      updatedCount++;
    }
  }

  console.log(
    `✅ Settlement flags seeded for ${updatedCount} student_meal_days docs`
  );
}

seedSettlementFlags()
  .then(() => {
    console.log("🎯 Seed script finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed script failed", err);
    process.exit(1);
  });
