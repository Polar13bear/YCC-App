# Yoganand Classes — Attendance & Student Management

## Tech Stack
- **Frontend**: React + Vite (runs on port 3000)
- **Backend**: Node.js + Express (runs on port 5000)
- **Database**: MongoDB (local, port 27017)

## Prerequisites
- Node.js v16+
- MongoDB installed and running locally

## Setup & Run

### 1. Start MongoDB
Make sure MongoDB is running on your machine:
```
mongod
```

### 2. Start Backend (Server)
```bash
cd server
npm run dev
```
Server starts at http://localhost:5000

### 3. Start Frontend (Client)
```bash
cd client
npm run dev
```
App opens at http://localhost:3000

## Features
- **Dashboard** — Overview of batches, students, today's attendance
- **Batches** — Create, edit, delete multiple batches with colors & schedules
- **Students** — Full student database with search & batch filter
- **Attendance** — Mark present/absent/late per batch per day, navigate dates
- **Reports** — Per-student attendance %, session history, batch analytics
