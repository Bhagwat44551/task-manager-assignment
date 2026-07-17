# Task Manager — Full Stack Assignment

A small full-stack task manager built with **Angular**, **Node.js/Express**, and **MongoDB**, with JWT-based authentication and full CRUD on tasks.

## Live Demo
- Frontend: `https://task-manager-assignment-1-kuco.onrender.com`
- Backend API: `https://task-manager-assignment-kb8u.onrender.com`

## Tech Stack
- **Frontend:** Angular 21 (standalone components, signals), TypeScript
- **Backend:** Node.js, Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing

## Features
- Register / Login (JWT issued on success, stored in localStorage)
- Protected routes (Angular route guard redirects to login if not authenticated)
- Create, read, update, delete tasks — scoped per logged-in user
- Mark tasks complete/incomplete
- Inline editing of tasks

## Setup Instructions

### Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: add your MongoDB Atlas connection string and a JWT secret
npm start
```
Runs on `http://localhost:5000` by default.

### Frontend
```bash
cd frontend
npm install
npx ng serve
```
Runs on `http://localhost:4200` by default. It expects the backend at `http://localhost:5000/api`.

## AI Tools Used
I used Claude to scaffold this project under a tight deadline, given I primarily work in the MERN stack (React) and this assignment specifically required Angular, which I have limited prior hands-on experience with.

**Where AI helped:**
- Generating the initial Angular component/service structure (standalone components, signals-based state, route guards)
- Scaffolding the Express routes and Mongoose schemas following patterns I already use in my own projects (StayWild — Node/Express/MongoDB)
- Writing boilerplate CRUD logic and JWT middleware quickly

**What I understood and can explain:**
- The overall auth flow: password hashing with bcrypt, JWT issuance/verification, and how the Angular auth guard blocks unauthenticated access to `/tasks`
- The REST API design: user-scoped queries (`Task.find({ owner: req.userId })`) so users only ever see their own tasks
- How Angular's standalone components and signals differ from the module-based patterns I'm used to, and how `HttpClient` is provided app-wide via `provideHttpClient()`
- The Mongoose schema relationships between `User` and `Task` via `ObjectId` references

**Challenges faced:**
- This was my first time working with Angular — the standalone component + signals API (introduced in recent Angular versions) is a different mental model from React hooks, so I spent time understanding how `signal()`, `computed()`, and the new `@if`/`@for` control-flow syntax work compared to JSX conditionals.
- Making sure JWT tokens were attached correctly to every protected API call via `HttpHeaders`.

**If I had more time, I would:**
- Add reactive forms with proper validation instead of basic template-driven forms
- Add an HTTP interceptor for attaching the auth token globally instead of doing it per-service-call
- Add pagination and search/filter for tasks
- Write unit tests for both the Angular components and Express routes
- Improve error handling with toast notifications instead of inline error text

## Project Structure
```
task-manager/
├── backend/
│   ├── models/       # User, Task Mongoose schemas
│   ├── routes/       # auth, tasks routes
│   ├── middleware/   # JWT auth middleware
│   └── server.js
└── frontend/
    └── src/app/
        ├── pages/login/
        ├── pages/tasks/
        ├── services/     # auth, task services
        └── guards/       # route guard
```
