# 🍽️ Smart Mess Card  
### Fair, Data-Driven & AI-Powered Hostel Mess Management

Smart Mess Card is a **web-based hostel mess management system** that links **actual meal attendance** with **billing, analytics, and AI-driven planning**.  
Instead of charging students based on assumptions, the system records **real meal usage** and enables **transparent, usage-based billing**, efficient mess operations, and accountable hostel administration.

---

## 🚩 Problem Statement

Most traditional hostel mess systems face the following challenges:
- Students are charged a **fixed daily fee (~₹300/day)** regardless of actual meal consumption  
- Skipped meals do not result in **refunds or adjustments**  
- Mess management lacks **accurate attendance data** for planning  
- This leads to **financial loss for students** and **avoidable food wastage**

---

## 💡 Solution Overview

Smart Mess Card addresses these challenges by:
- Tracking **meal-wise attendance** instead of assuming consumption  
- Using **QR-based verification** during meal time  
- Allowing **advance absence declaration (at least 24 hours prior)**  
- Applying a **fair, percentage-based penalty** for no-shows  
- Managing savings through a **digital wallet system**  
- Providing **analytics and AI-powered predictions** for better planning  

---

## 🔁 How the System Works

1. **Mess managers apply for a tender**, which is reviewed and approved by the Hostel Office.  
2. **Students verify their hostel fee receipt** and select a mess from the approved list.  
3. During meal time, **students generate a secure, time-bound QR code**.  
4. **Mess staff scan the QR code**, and meal attendance is recorded instantly.  
5. Based on attendance or absence rules, **wallet credits or penalties are applied automatically**.  
6. All data is securely stored and used to generate **analytics, insights, and AI-based predictions**.

> This workflow ensures fairness for students, accurate planning for mess management, and transparency across the system.

---

## 🛠️ Technology Stack

The platform is built using **modern, scalable, and production-ready technologies**.

### Frontend
- **React (TypeScript)** – Type-safe and scalable frontend architecture  
- **shadcn/ui** – Modern, accessible UI components  
- **Recharts** – Interactive charts for analytics dashboards  

### Backend
- **Node.js + Express.js** – RESTful backend APIs and business logic  
- **Firebase Cloud Functions** – Serverless execution for QR validation, wallet updates, and penalties  

### QR & Image Processing
- **jsQR** – Client-side decoding of QR codes during meal scanning  
- **Google Cloud Vision API** – Image-based QR and visual verification support (fallback and enhancements)  

### Authentication
- **Firebase Authentication** – Secure authentication for students and mess staff  

### Data & Analytics
- **Cloud Firestore** – Real-time storage of attendance, wallet transactions, and feedback  
- **BigQuery** – Aggregation and analysis of historical data for insights and reporting  

### AI & Machine Learning
- **Vertex AI (Gemini 2.5 Flash)** – Predicts student turnout and food demand  
- **Cloud Natural Language API** – Performs sentiment analysis and tagging on student feedback  

---


## 👨‍🎓 Student Dashboard

The student dashboard focuses on **fair billing, transparency, and control over meal usage**.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/student-wallet.png.jpeg" width="450"/><br/>
      <sub>Wallet & Credits</sub>
    </td>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/student-qr.png.jpeg" width="450"/><br/>
      <sub>QR Meal Attendance</sub>
    </td>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/student-analytics.png.jpeg" width="450"/><br/>
      <sub>Meal History </sub>
    </td>
  </tr>
</table>

**What students can do**
- Digitally verify hostel office fee receipts  
- Select a mess based on available wallet credits  
- Declare meal absence at least **24 hours in advance**  
- Generate time-bound QR codes for meal attendance  
- Track wallet balance, saved credits, and meal history  
- Submit feedback with **auto-generated sentiment and tags**

---

## 🧑‍🍳 Mess Management Dashboard

The mess management dashboard helps **monitor operations, revenue, and food planning**.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/mess-attendance.png.jpeg" width="450"/><br/>
      <sub>Attendance Overview</sub>
    </td>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/mess-revenue.png.jpeg" width="450"/><br/>
      <sub>Revenue & Peak Hours</sub>
    </td>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/mess-predictions.png" width="450"/><br/>
      <sub>AI Predictions</sub>
    </td>
  </tr>
</table>

**What mess management can do**
- Apply for mess-management role and tender approval  
- Scan student QR codes during meal entry  
- View real-time student attendance  
- Monitor revenue and peak meal hours  
- Predict future student turnout and food wastage using AI  
- Access anonymous, sentiment-based student feedback  

---

## 🏢 Hostel Office / Authority Dashboard

This dashboard provides **oversight, approvals, and role-based transparency**.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/hostel-approvals.png" width="400"/><br/>
      <sub>Mess Approval & Tenders</sub>
    </td>
    <td align="center">
      <img src="https://github.com/Annapurna-Jadhav/SmartMessCard/blob/main/images/hostel-approvedMess.png" width="400"/><br/>
      <sub>Approved Messes</sub>
    </td>
  </tr>
</table>

**What hostel authorities can do**
- Approve or reject mess tenders  
- Verify student fee receipts  
- Manage role-based access for multiple authorities  
- Monitor the system for transparency and accountability  

---

## 📊 Analytics & AI Insights

This section converts raw data into **actionable insights for planning and optimization**.

<table>
  <tr>
    <td align="center">
      <img src="./images/analytics-attendance.png" width="300"/><br/>
      <sub>Attendance Trends</sub>
    </td>
    <td align="center">
      <img src="./images/analytics-prediction.png" width="300"/><br/>
      <sub>Demand & Wastage Prediction</sub>
    </td>
  </tr>
</table>

**Insights generated**
- Meal attendance trends over time  
- Revenue and usage patterns  
- Predicted student turnout  
- Food demand and wastage estimation  

---

## 💬 Feedback & Sentiment Analysis

Student feedback is transformed into **clear, actionable improvements**.

<table>
  <tr>
    <td align="center">
      <img src="./images/feedback-sentiment.png" width="300"/><br/>
      <sub>Sentiment Overview</sub>
    </td>
    <td align="center">
      <img src="./images/feedback-tags.png" width="300"/><br/>
      <sub>Tag-Based Insights</sub>
    </td>
  </tr>
</table>

**Features**
- Anonymous student feedback collection  
- Automatic sentiment classification  
- Tag-based issue identification (taste, hygiene, quantity, etc.)  
- Faster and more informed action by mess management  

---

## 📈 Impact & Benefits

- Fair, usage-based billing for students  
- Students can save unused meal credits  
- Reduced food wastage through accurate planning  
- Data-driven mess operations  
- Transparent and auditable system  
- Faster action through clear feedback insights  

---

## 🚀 Future Scope

- Face verification for faster and secure meal entry  
- Unified campus wallet for food courts, canteens, and outlets  
- Advanced AI-based demand and wastage prediction  
- Role-based transparency for multiple management authorities  

---

## 🏁 Conclusion

Smart Mess Card modernizes hostel mess operations by combining **real-time data, analytics, and AI**.  
It ensures fairness for students, efficiency for mess management, and transparency for authorities—making it a **scalable, real-world ready solution**.

---

### Built for TechSprint by google
