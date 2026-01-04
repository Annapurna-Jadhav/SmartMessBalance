import db from "../config/firestore.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import { VertexAI } from "@google-cloud/vertexai";


const MEALS = ["breakfast", "lunch", "snacks", "dinner"];



export const getMessAnalytics = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { fromDate, toDate } = req.query;

  const messSnap = await db
    .collection("messes")
    .where("messAuth.uid", "==", uid)
    .where("isActive", "==", true)
    .limit(1)
    .get();

  if (messSnap.empty) {
    throw new ApiError(403, "Mess not found");
  }

  const messId = messSnap.docs[0].id;

  const end = toDate || new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const start =
    fromDate ||
    new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  const snap = await db
    .collection("messes")
    .doc(messId)
    .collection("daily_analytics")
    .where("date", ">=", start)
    .where("date", "<=", end)
    .orderBy("date", "asc")
    .get();

    const totals = {
    served: 0,
    declaredAbsent: 0,
    noShow: 0,
    foodWaste: 0,
  };

  const daily = snap.docs.map(d => {
    const data = d.data();

    if (data.totals) {
      totals.served += data.totals.served || 0;
      totals.declaredAbsent += data.totals.declaredAbsent || 0;
      totals.noShow += data.totals.noShow || 0;
    }

    return data;
  });

  totals.foodWaste =
    totals.noShow;

  return res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Analytics data fetched",
      data: {
        range: { start, end },
        daily,
        totals
      },
    })
  );
});



export const buildAnalyticsSummaryForMess = async (messAuthUid, days = 7) => {
  const messSnap = await db
    .collection("messes")
    .where("messAuth.uid", "==", messAuthUid)
    .where("isActive", "==", true)
    .limit(1)
    .get();

  if (messSnap.empty) throw new Error("Mess not found");

  const messId = messSnap.docs[0].id;


  const end = new Date(Date.now() - 86400000); 
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  const startDate = start.toISOString().split("T")[0];
  const endDate = end.toISOString().split("T")[0];

  const snap = await db
    .collection("messes")
    .doc(messId)
    .collection("daily_analytics")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "asc")
    .get();

  
  const totals = {
    served: 0,
    declaredAbsent: 0,
    noShow: 0,
    foodWaste: 0,
  };

  const mealWise = {};
  const peakTracker = {};
  const daily = [];

  const dayOfWeekStats = {
    0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {},
  };

  for (const meal of MEALS) {
    mealWise[meal] = { served: 0, declaredAbsent: 0, noShow: 0 };
    peakTracker[meal] = {};

    for (const d of Object.keys(dayOfWeekStats)) {
      dayOfWeekStats[d][meal] = { served: 0, count: 0 };
    }
  }

 
  for (const doc of snap.docs) {
    const d = doc.data();
    daily.push(d);

    const dayIndex = new Date(d.date).getDay();

    totals.served += d.totals.served;
    totals.declaredAbsent += d.totals.declaredAbsent;
    totals.noShow += d.totals.noShow;

    for (const meal of MEALS) {
      const m = d.meals[meal];
      if (!m) continue;

      mealWise[meal].served += m.served;
      mealWise[meal].declaredAbsent += m.declaredAbsent;
      mealWise[meal].noShow += m.noShow;

      dayOfWeekStats[dayIndex][meal].served += m.served;
      dayOfWeekStats[dayIndex][meal].count++;

      if (m.peakBucket) {
        peakTracker[meal][m.peakBucket] =
          (peakTracker[meal][m.peakBucket] || 0) + 1;
      }
    }
  }

  totals.foodWaste = totals.declaredAbsent + totals.noShow;


  const peakHours = {};
  for (const meal of MEALS) {
    let peak = null;
    let max = 0;

    for (const [bucket, count] of Object.entries(peakTracker[meal])) {
      if (count > max) {
        max = count;
        peak = bucket;
      }
    }
    peakHours[meal] = peak;
  }

 
  const averages = {};
  for (const meal of MEALS) {
    averages[meal] = Math.round(
      mealWise[meal].served / Math.max(daily.length, 1)
    );
  }


  const trendHint = {};
  for (const meal of MEALS) {
    if (daily.length < 4) {
      trendHint[meal] = "INSUFFICIENT_DATA";
      continue;
    }

    const mid = Math.floor(daily.length / 2);
    const firstHalf = daily.slice(0, mid);
    const secondHalf = daily.slice(mid);

    const avg1 =
      firstHalf.reduce((s, d) => s + d.meals[meal].served, 0) /
      firstHalf.length;
    const avg2 =
      secondHalf.reduce((s, d) => s + d.meals[meal].served, 0) /
      secondHalf.length;

    trendHint[meal] =
      avg2 > avg1 ? "INCREASING" : avg2 < avg1 ? "DECREASING" : "STABLE";
  }

  return {
    range: { start: startDate, end: endDate },
    totals,
    mealWise,
    peakHours,
    averages,
    trendHint,
    dayOfWeekStats,
    daily,
  };
};





export const getMessAnalyticsSummary = asyncHandler(async (req, res) => {
  const days = Number(req.query.days || 7);

  const summary = await buildAnalyticsSummaryForMess(
    req.user.uid,
    days
  );

  return res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Analytics summary",
      data: summary,
    })
  );
});

export const generateAnalyticsInsights = asyncHandler(async (req, res) => {
  const summary = await buildAnalyticsSummaryForMess(req.user.uid, 30);

  const insights = [];

  if (summary.totals.foodWaste > summary.totals.served * 0.15) {
    insights.push(
      "Food waste is high. Consider reducing meal preparation or improving attendance tracking."
    );
  }

  for (const meal of MEALS) {
    if (summary.mealWise[meal].noShow > summary.mealWise[meal].served * 0.3) {
      insights.push(
        `High no-show rate observed during ${meal}. Consider reducing quantity.`
      );
    }
  }

  if (summary.peakHours.breakfast) {
    insights.push(
      `Breakfast peak time is around ${summary.peakHours.breakfast}. Ensure counters are staffed accordingly.`
    );
  }

  return res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Analytics insights generated",
      data: {
        insights,
        summary,
      },
    })
  );
});
export const askMessAnalyticsAI = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    throw new ApiError(400, "Question is required");
  }


  const summary = await buildAnalyticsSummaryForMess(
    req.user.uid,
    30
  );

  
  const q = question.toLowerCase();
  const isPredictionQuery =
    q.includes("predict") ||
    q.includes("forecast") ||
    q.includes("expected") ||
    q.includes("will") ||
    q.match(/\bjan\b|\bfeb\b|\bmar\b|\bapr\b/);

  const vertexAI = new VertexAI({
    project: process.env.GCP_PROJECT_ID,
    location: "us-central1",
  });

  const model = vertexAI.getGenerativeModel({
    model: "gemini-2.5-pro",
  });

  
const prompt = `
You are a friendly, experienced assistant helping a college mess manager.

Your personality:
- Human-like and confident
- Calm, clear, and practical
- Supportive, not robotic or academic

Your role:
- Answer questions about attendance, food demand, waste, revenue, profit/loss, and planning
- Help the user understand what is happening and what actions make sense

IMPORTANT RESPONSE RULES:
- Give a balanced answer: informative but not lengthy
- Aim for a medium-length response (about 5–7 readable lines)
- Do NOT dump everything at once
- Do NOT over-explain unless the user asks for more
- Avoid unnecessary sections

DATA RULES (STRICT):
- Use ONLY the data provided below
- Do NOT invent numbers or assumptions
- If something cannot be calculated from the data, say so clearly
- You MAY estimate or extrapolate trends, but clearly mention that it is an estimate

WRITING & FORMATTING STYLE:
- Write in **clear paragraphs**
- Use **bold text** to highlight important points or numbers
- Use **bullet points** only where it improves clarity
- Use **short bold headings** when they help readability
- Avoid long paragraphs
- Keep the tone natural and conversational, like ChatGPT
- Emojis are optional but should be minimal and subtle

Context:
This data is from a college mess for the period:
${summary.range.start} to ${summary.range.end}

Available analytics data:
${JSON.stringify(summary, null, 2)}

User question:
"${question}"

HOW TO STRUCTURE THE ANSWER:
- Start with a **direct, clear answer** to the question
- Follow with a **short explanation** using the data
- Mention **key trends** only if they add value
- Include **1–2 practical, implementable suggestions**
- If there is uncertainty, express it naturally (e.g., “this may vary”, “based on recent patterns”)
- Do NOT explicitly label confidence levels

DEPTH CONTROL (VERY IMPORTANT):
- Default response should be medium detail
- If the user asks “why”, “explain more”, “break down”, or “deep dive”, THEN go deeper
- Otherwise, stop once the main insight and actions are clear

Now generate a clear, confident, human-friendly response that is easy to read and act on.
`;

  /* 5️⃣ Generate response */
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const answer =
    result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Unable to generate response";

  /* 6️⃣ Return */
  return res.json(
    new ApiResponse({
      statusCode: 200,
      message: isPredictionQuery
        ? "Prediction generated"
        : "Analytics insight generated",
      data: {
        mode: isPredictionQuery ? "PREDICTION" : "ANALYTICS",
        question,
        answer,
        range: summary.range,
      },
    })
  );
});



