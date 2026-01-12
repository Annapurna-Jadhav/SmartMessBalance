# 🍽️ Smart Mess Card  
### Fair, Data-Driven & AI-Powered Hostel Mess Management

Smart Mess Card is a **web-based mess management platform** that connects **actual meal attendance** with **billing, analytics, and AI-driven planning**.  
It replaces fixed, assumption-based charging with a **transparent, usage-driven system** for students, mess management, and hostel authorities.

---

## 🚩 Problem Statement

Traditional hostel mess systems suffer from:
- Fixed daily mess fees (~₹300/day) regardless of actual usage  
- No refund or adjustment for skipped meals  
- Lack of real attendance data for mess planning  
- Financial loss for students and significant food wastage  

---

## 💡 Solution Overview

Smart Mess Card introduces:
- Meal-wise attendance tracking  
- QR-based verification during meal time  
- Advance absence declaration (≥ 24 hours)  
- Fair, percentage-based penalty system  
- Wallet-based credit management  
- Analytics and AI-powered predictions  

---

## 🧩 Stakeholders

- **Students** – Fair billing, savings, transparency  
- **Mess Management** – Accurate planning, revenue insights  
- **Hostel Office / Authorities** – Oversight and accountability  

---

## 🔄 High-Level System Flow

This section explains how the system works end-to-end.

1. **Mess managers apply for a tender**, which is reviewed and approved by the Hostel Office.  
2. **Students verify their hostel fee receipt** and select a mess from the approved list.  
3. During meal time, **students generate a secure, time-bound QR code**.  
4. **Mess staff scan the QR code**, and meal attendance is recorded instantly.  
5. Based on attendance or absence rules, **wallet credits or penalties are applied automatically**.  
6. All data is securely stored and used to generate **analytics, insights, and AI-based predictions**.

> This flow ensures fairness for students, accurate planning for mess management, and transparency for hostel authorities.

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

## 🛠️ Technology Stack

### Authentication & Backend
- **Firebase Authentication** – Secure user access  
- **Firebase Cloud Functions** – QR validation, wallet logic, penalties  

### Data & Analytics
- **Cloud Firestore** – Real-time attendance, wallet, feedback data  
- **BigQuery** – Historical analytics and aggregation  

### Frontend
- **Recharts** – Interactive dashboards and visual analytics  

### AI & ML
- **Vertex AI (Gemini 2.5 Flash)** – Attendance and demand prediction  
- **Cloud Natural Language API** – Feedback sentiment and tagging  

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
