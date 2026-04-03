# 🌍 ColonyCare – Smart Complaint Management System

## 📌 Project Overview

ColonyCare is a full-stack web application designed to help residents report and track local civic issues such as potholes, drainage problems, streetlight failures, and more. It enables colony admins to efficiently manage and resolve complaints with real-time tracking and smart categorization.

---

## 🚀 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Spring Boot (REST APIs)
* Spring Data JPA

### Database

* H2 Database (Development)
* Easily extendable to MySQL (Production)

### Tools

* Git & GitHub
* Postman
* VS Code / STS (Spring Tool Suite)

---

## ✨ Features

### 👤 Resident Module

* Register / Login
* Submit complaints with:

  * Description
  * Image upload 📷
  * Issue type (Pothole, Drainage, Streetlight, etc.)
* Auto location/area tagging
* Track complaint status (Pending → In Progress → Resolved)
* View personal complaints

---

### 🛠️ Admin Module

* View complaints based on colony/area
* Filter complaints by:

  * Status
  * Category
* Update complaint status
* Manage and resolve issues efficiently

---

### 🤖 Smart Features

* AI-based complaint categorization
* Location-based complaint filtering
* Time tracking for unresolved issues
* Priority handling (future scope)
* Upvote system for popular complaints (future scope)

---

## ⚙️ How to Run the Project

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/Srinidhi1206/complaintmanagement.git
cd complaintmanagement
```

---

### 🔹 2. Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

👉 Backend runs on: **http://localhost:8081**

---

### 🔹 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

👉 Frontend runs on: **http://localhost:5173**

---

### 🔹 4. H2 Database Console

```text
URL: http://localhost:8081/h2-console
JDBC URL: jdbc:h2:mem:complaintdb
Username: sa
Password: (leave empty)
```

---

## 🔄 Application Flow

1. User registers with name, phone, and area
2. User submits complaint (image + description)
3. Complaint stored in database with **Pending status**
4. Admin views complaints for their colony
5. Admin updates status
6. User gets updated status in dashboard

---

## 🧠 Future Enhancements

* 🔔 Real-time notifications
* 📍 Google Maps integration
* 📊 Admin analytics dashboard
* 🗳️ Complaint upvote system
* 📱 Mobile app support
* ☁️ Cloud deployment (AWS / Render)

---

## 👩‍💻 Author

**Srinidhi Akkenapally**

---

## ⭐ Contribution

Feel free to fork this repo and contribute!

---
