# 🚀 Internship Task Tracker – Full Stack Project

A modern **full-stack task management application** built to help students and interns efficiently manage tasks, track progress, and stay organized during internships.

This project demonstrates **end-to-end development**, including authentication, CRUD operations, dashboard analytics, filters, priority handling, due dates, dark mode, and deployment readiness.

---

## 🔗 Live Demo & Repository

- 🌐 **Frontend (Demo):** https://your-frontend-link.netlify.app  
- ⚙️ **Backend API:** https://your-backend-link.onrender.com  
- 📦 **GitHub Repository:** https://github.com/ashokkaji26/internship-task-tracker.git 

---

## 🧠 Key Highlights (Why this project stands out)

- 🔐 User Registration & Login (persistent login)
- 📝 Create, Edit, Delete tasks
- ✅ Mark tasks as **Pending / In Progress / Completed**
- 🎯 Assign **Task Priority** (Low / Medium / High)
- 📅 Set **Due Dates** with overdue detection
- ⏰ Visual indication for **Overdue Tasks**
- 📊 Dashboard with real-time task counters
- 🔍 Task filters (All, Pending, In Progress, Completed)
- 🌙 Dark Mode with persistence & accessibility-friendly contrast
- 🎨 Clean, professional UI (Light & Dark themes)
- ⚡ RESTful backend with MongoDB
- ☁️ Deployment-ready architecture

---

## 🛠️ Tech Stack

### Frontend
- HTML5  
- CSS3 (Modern UI + Dark Mode)  
- JavaScript (Vanilla JS)  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### Tools & Platforms
- Git & GitHub  
- Render (Backend Deployment)  
- Netlify / GitHub Pages (Frontend Deployment)  

---

## 📂 Project Structure


Internship-Task-Tracker/
│
├── client/                 
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── server/                 
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── README.md
└── .gitignore

---

## Features Explained

### 👤 User Management
	•	Register new users  
	•	Login existing users  
	•	Persistent login using localStorage  
	•	Secure logout  

### 📋 Task Management
	•	Add new tasks with title & description  
	•	Edit task details  
	•	Delete tasks  
	•	Change task status (Pending ↔ In Progress ↔ Completed)  

### 🎯 Task Priority
	•	Assign priority while creating tasks  
	•	Supported priorities:
		- Low
		- Medium
		- High
	•	Visual priority badges for quick recognition  

### 📅 Due Date & Overdue Tracking
	•	Set due date for each task  
	•	Automatically detect overdue tasks  
	•	Clear visual warning for overdue tasks  
	•	Improves real-world task planning & accountability  

### 📊 Dashboard
	•	Total tasks count  
	•	Pending tasks count  
	•	In-progress tasks count  
	•	Completed tasks count  

### 🔎 Filters
	•	View tasks by status:
		- All  
		- Pending  
		- In Progress  
		- Completed  

### 🌙 Dark Mode
	•	One-click toggle  
	•	User preference saved  
	•	Clean contrast & readability  
	•	Accessible dark UI (not overly dark)  

---

## API Endpoints (Backend)

### Users
- POST   /api/users        → Register user  
- GET    /api/users        → Get all users  

### Tasks
- POST   /api/tasks        → Create task (with priority & due date)  
- GET    /api/tasks/:id   → Get tasks by user  
- PUT    /api/tasks/:id   → Update task  
- DELETE /api/tasks/:id   → Delete task  

---

## Environment Setup (Local)

1. Clone Repository  

2. Backend Setup  
    - cd server  
    - npm install  
    - create .env file  
        - PORT=4000  
        - MONGO_URI=your_mongodb_connection_string  
    - Run backend: npm run dev  

3. Frontend Setup  
    - cd client  
    - Open index.html using Live Server or browser  

---

## Deployment Strategy
	•	Backend deployed on Render  
	•	Frontend deployed on Netlify / GitHub Pages  
	•	API base URL updated for production  

---

## Learning Outcomes

### This project helped me strengthen:
- Full-stack architecture understanding  
- REST API design  
- Frontend ↔ Backend data flow  
- Database schema design (real-world fields like priority & due date)  
- State management without frameworks  
- UI/UX principles  
- Debugging real-world production issues  
- Deployment workflows  

---

## Author :-
- Ashok Kaji  
- B.Tech CSE | IIIT Lucknow  
- Aspiring Software Engineer | Full-Stack Developer  

- **GitHub**: https://github.com/ashokkaji26  
- **LinkedIn**: https://www.linkedin.com/in/ashokkaji26/  