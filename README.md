# 🧪 ReproLab

**Bug tracking & reproduction platform built with the MERN stack.**

ReproLab helps teams report bugs in a structured way (steps to reproduce, expected vs. actual result, severity, priority, environment) so anyone can reproduce and fix them quickly.

🔗 **Live API:** https://reprolab.onrender.com
> The API runs on Render's free tier, so the first request may take up to ~50 seconds to wake the server.

---

## ✨ Features

- 🔐 **Authentication** with JWT and bcrypt password hashing
- 🛡️ **Authorization**: roles (`user`, `admin`) + ownership checks
- 📁 **Projects** CRUD
- 🐞 **Bugs** CRUD with status workflow: `New → In Progress → Fixed → Verified → Closed`
- 🔎 **Search, filtering and pagination**
- 💬 **Comments** on bugs
- 🕒 **Activity log** (timeline of status and assignee changes)
- 👑 **Admin API**: manage users, change roles, system statistics
- ✅ **Validation** middleware on all inputs
- 🧱 **MVC architecture**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JSON Web Tokens, bcrypt |
| Frontend | React (Vite), React Router |
| Deployment | Render (API) |

---

## 📂 Backend Structure

```
backend/
├── config/         # DB connection and constants (enums)
├── controllers/    # Business logic
├── middleware/     # auth (protect, authorizeRole) and validation
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── utils/          # Helpers (pagination, regex escape, ownership check)
├── .env.example
└── server.js
```

**Request flow:** `Route → Middleware (auth, validation) → Controller → Model → Response`

---

## 🗃️ Data Models

| Model | Main fields |
|---|---|
| **User** | name, email, password (hashed), role |
| **Project** | name, description, owner |
| **Bug** | title, stepsToReproduce, expectedResult, actualResult, environment, severity, priority, status, project, reporter, assignee |
| **Comment** | text, bug, author |
| **ActivityLog** | bug, user, action, from, to |

---

## 🔌 API Endpoints

Base URL: `https://reprolab.onrender.com/api`

🔒 = requires `Authorization: Bearer <token>` · 👑 = admin only

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Login and receive a JWT |
| GET | `/auth/me` 🔒 | Get the current user |

### Projects 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects?search=&page=&limit=` | List projects |
| POST | `/projects` | Create a project |
| GET | `/projects/:id` | Get one project |
| PUT | `/projects/:id` | Update (owner or admin) |
| DELETE | `/projects/:id` | Delete with its bugs (owner or admin) |

### Bugs 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects/:projectId/bugs?search=&status=&severity=&priority=&page=&limit=` | List, search, filter, paginate |
| POST | `/projects/:projectId/bugs` | Report a bug |
| GET | `/bugs/:id` | Get one bug |
| PUT | `/bugs/:id` | Update (reporter or admin) |
| DELETE | `/bugs/:id` | Delete (reporter or admin) |
| GET | `/bugs/:id/activity` | Bug timeline |

### Comments 🔒
| Method | Endpoint | Description |
|---|---|---|
| GET | `/bugs/:id/comments` | List comments |
| POST | `/bugs/:id/comments` | Add a comment |
| DELETE | `/comments/:id` | Delete (author or admin) |

### Admin 👑
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users?search=` | List users |
| PUT | `/admin/users/:id/role` | Change a user's role |
| DELETE | `/admin/users/:id` | Delete a user |
| GET | `/admin/stats` | Totals and bugs by status/severity |

### Status codes
`200` OK · `201` Created · `400` Bad request · `401` Not authenticated · `403` Not authorized · `404` Not found · `409` Conflict · `500` Server error

---

## 🚀 Running the Backend Locally

**Requirements:** Node.js 18+, a MongoDB Atlas cluster.

```bash
git clone https://github.com/hebaalshannaq-coder/reprolab.git
cd reprolab/backend
npm install
```

Create a `.env` file inside `backend/` (see `.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
SALT_ROUNDS=10
FRONTEND_URL=http://localhost:5173
```

Generate a secure `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

The API runs on `http://localhost:5000`.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (set automatically on Render) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `SALT_ROUNDS` | bcrypt cost factor (default 10) |
| `FRONTEND_URL` | Allowed frontend origin (CORS) |

> ⚠️ Never commit your `.env` file.

---

## 👑 Creating the First Admin

Registration always creates a regular `user` (to prevent privilege escalation). To create the first admin, register normally, then in MongoDB Atlas change that user's `role` to `"admin"`. Admins can then promote others through the Admin API.

---

## 🖥️ Frontend

React (Vite) app in `/frontend`. *Setup instructions coming soon.*

```bash
cd frontend
npm install
npm run dev
```

---

## 👩‍💻 Author

**Heba Alshannaq**: DOT Jordan Full-Stack Web Development Bootcamp, Final Project