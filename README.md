# 🎓 Secure College Portal (DevOps Enabled)

A role-based web application built using the **MERN stack** with integrated **Docker containerization** and **CI/CD pipeline** for automated build and deployment.

---

## 🚀 Project Overview

The **Secure College Portal** allows students to browse and request enrollment in courses, while administrators manage courses, students, and enrollment approvals.

This project also demonstrates real-world **DevOps practices**, including containerization using Docker and automation using CI/CD pipelines.

---

## 🛠️ Tech Stack

### 💻 Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Recharts

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MongoDB (Atlas)

### 🔐 Authentication

* JWT (JSON Web Tokens)
* OTP Verification (Nodemailer)

### ⚙️ DevOps Tools

* Docker
* Docker Compose
* GitHub Actions (CI/CD)
* Cloud Deployment (AWS / Render)

---

## 👥 Features

### 👨‍🎓 Student

* Register & Login with OTP verification
* View available courses
* Request course enrollment
* View dashboard

### 👑 Admin

* Manage courses (Create/Update)
* Manage students
* Approve/Reject enrollment requests
* Dashboard analytics

### ⚙️ System

* Role-based access control
* Secure API with JWT
* Background jobs using node-cron
* Containerized application using Docker
* Automated CI pipeline using GitHub Actions

---

## 🐳 Docker Setup

### 📦 Run the application using Docker

```bash
docker compose up --build
```

👉 Frontend: http://localhost:3000
👉 Backend: http://51.20.31.138:5000

---

## 🔄 CI/CD Pipeline

* Implemented using **GitHub Actions**
* Automatically builds the Docker containers on every push to the main branch
* Ensures continuous integration and reduces manual deployment effort

---

## ☁️ Deployment

The application is designed to be deployed on cloud platforms such as:

* AWS (EC2)
* Render

---

## 📸 Screenshots

* Docker containers running
* Application UI (Login, Dashboard)
* GitHub Actions pipeline

---

## 🎯 Learning Outcomes

* Understanding of MERN stack development
* Implementation of Docker containerization
* Setup of CI/CD pipeline
* Cloud deployment basics
* Real-world DevOps workflow

---

## 📌 Conclusion

This project demonstrates how modern web applications can be built, containerized, and deployed efficiently using DevOps practices, ensuring scalability, automation, and reliability.

---

## 👨‍💻 Author

**Chinthan Rai**
