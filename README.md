# Ravi Bhushan — Portfolio

Full-stack portfolio built with **React + Vite** (client) and **Node.js + Express + MongoDB** (server).

---

## Project Structure

```
portfolio_final/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Hero/
│   │   │   ├── About/
│   │   │   ├── Projects/
│   │   │   ├── Skills/
│   │   │   └── Contact/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        ← single global stylesheet
│   ├── data/
│   │   ├── Realdata/        ← projectData.js, aiData.js
│   │   └── screenshots/
│   └── .env.example
│
└── server/                  # Node.js + Express + MongoDB
    ├── config/db.js
    ├── controllers/contactController.js
    ├── models/Contact.js
    ├── routes/contact.js
    ├── server.js
    └── .env.example
```

---

## Setup

### 1. Client

```bash
cd client
cp .env.example .env
# Fill in VITE_API_URL and VITE_APP_GEMINI_API_KEY
npm install
npm run dev
```

### 2. Server

```bash
cd server
cp .env.example .env
# Fill in MONGO_URI and CLIENT_URL
npm install
npm run dev
```

### Environment Variables

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_GEMINI_API_KEY=your_gemini_key
```

**server/.env**
```
PORT=5000
MONGO_URI=your_mongodb_uri
CLIENT_URL=http://localhost:5173
```

---

## API Endpoints

| Method | Route           | Description               |
|--------|-----------------|---------------------------|
| GET    | /api/health     | Server health check       |
| POST   | /api/contact    | Submit contact form       |
| GET    | /api/contacts   | View all submissions      |

---

## Deploy

- **Client**: Deploy `client/` to Vercel (set env vars in dashboard)
- **Server**: Deploy `server/` to Railway / Render (set env vars in dashboard)
- Update `CLIENT_URL` in server env to your Vercel domain
- Update `VITE_API_URL` in client env to your server domain
