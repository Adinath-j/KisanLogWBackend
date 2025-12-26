# Perplexity/AI Prompt for KisanLog Project Report

**Copy and paste the text below into Perplexity AI (or ChatGPT/Claude) to generate a customized project report.**

---

**PROMPT STARTS HERE**

I need you to act as a Technical Writer and generate a comprehensive **Project Report** for a Hackathon project called **"KisanLog"** (formerly FarmTracker).

**Report Structure Required:**
1. **Introduction** (Overview, Problem Statement, Objectives, Scope)
2. **Software Requirements And Specifications** (Functional & Non-Functional Req, Tech Stack)
3. **Project Plan** (Phases, Timeline, Methodology)
4. **Design Strategy** (Architecture, Database Design, API Design, UI/UX)
5. **Future Work** (Planned enhancements)
6. **Conclusion** (Impact, Achievements)
7. **References**

**Project Context & Technical Details:**

*   **Project Name:** KisanLog
*   **Description:** A comprehensive web-based farm management system for Indian farmers to track agricultural expenses, record crop yields, and analyze profitability across different seasons (Kharif, Rabi, Zaid).
*   **Target Audience:** Small to medium-scale Indian farmers.

**Technical Stack:**
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (No frameworks), Chart.js for visualizations, jsPDF for reports.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (using Mongoose ODM).
*   **Authentication:** JWT (JSON Web Tokens) stored in httpOnly cookies, bcryptjs for password hashing.
*   **Security:** CORS configured, Input validation, Protected routes.

**Key Features:**
1.  **Authentication:** Secure Login/Register/Logout with password visibility toggle. Verification of ownership for data access.
2.  **Dashboard:** Central hub with overview cards (Total Expense, Revenue, Net Profit).
3.  **Expense Management:** Add/Edit/Delete expenses. Categories: Seeds, Fertilizers, Pesticides, machinery, etc.
4.  **Yield Management:** Add/Edit/Delete yields. Auto-calculation of revenue (Quantity * Price).
5.  **Seasonal Analysis:** Support for specific Indian agricultural seasons: Kharif (Monsoon), Rabi (Winter), Zaid (Summer).
6.  **Visual Analytics:** Expenses breakdown pie chart, Crop comparison bar charts (Expense vs Revenue).
7.  **Reporting:** Export detailed reports as PDF or CSV.
8.  **Responsive Design:** Mobile-friendly UI with "KisanLog" branding.

**Database Schema Overview:**
*   **User:** `fullName`, `email` (unique), `mobile`, `location`, `password` (hashed).
*   **Expense:** `user` (ref), `date`, `crop`, `category` (enum), `season` (enum), `description`, `amount`.
*   **Yield:** `user` (ref), `date`, `crop`, `season`, `quantity`, `unit`, `pricePerUnit`, `totalRevenue`.

**Project Architecture:**
*   **Pattern:** Three-Tier Architecture (Presentation, Application, Data).
*   **Communication:** RESTful API.
*   **Folder Structure:** Clearly separated `frontend` (assets, dashboard pages) and `backend` (models, routes, middleware).

**Please write the report in a professional, academic yet practical tone suitable for a Hackathon submission.**

**PROMPT ENDS HERE**
