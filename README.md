# 🏥 Smart Healthcare Appointment System

A full-stack MERN (MongoDB, Express, React, Node.js) application designed to simplify healthcare appointment booking and management. Patients can view doctor schedules, book slots, and download receipts, while doctors and admins can manage appointments through a dashboard.

---

## ✨ Features

- **Patient Portal**
  - Register/Login with JWT authentication
  - View available doctors and schedules
  - Book appointments with date & time slot
  - Cancel appointments
  - Download PDF receipts for bookings

- **Doctor/Admin Dashboard**
  - Manage schedules and appointments
  - View all patient bookings
  - Switch between patient and admin views
  - Appointment status tracking (booked, canceled, completed)

- **Backend**
  - RESTful API built with Express.js
  - MongoDB for storing users, doctors, and appointments
  - PDF receipt generation using `pdfkit`

- **Frontend**
  - React.js with Axios for API calls
  - Interactive dashboard with charts (Chart.js)
  - Modern UI with responsive design

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Axios, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Token)
- **PDF Generation:** pdfkit

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/healthcare-app.git
   cd healthcare-app
