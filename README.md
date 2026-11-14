# Travel Around 🌍 — AI Travel Planner

> An AI-powered collaborative travel management and itinerary planning platform built with Domain-Driven Design (DDD) principles.

---

## 🚀 Overview

**Travel Around** combines real-world geospatial intelligence with Google Gemini AI to generate custom, day-by-day travel itineraries. The platform facilitates community-driven group travel coordination with real-time Socket.io chat rooms, organiser management dashboards, and push notifications.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **React 18** with **Vite**
- **Tailwind CSS v4** for modern responsive styling
- **Radix UI** primitives & **Lucide React** icons
- **Socket.io Client** for real-time messaging and alerts
- **Axios** with session cookie support (`withCredentials: true`)
- **OpenStreetMap Nominatim & Overpass API** for real-world POIs and hotel suggestions

### Backend (`server/`)
- **Node.js** & **Express** (ES Modules)
- **MongoDB** & **Mongoose** for data persistence
- **Express-Session** & **connect-mongo** for secure `httpOnly` session cookies
- **Socket.io** for authenticated real-time group chat and notification broadcasts
- **Google Generative AI SDK** (`@google/generative-ai`)
- **Bcrypt.js** for password encryption

---

## 📁 Repository Structure

```
TravelPlanner/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets (images, icons)
│   ├── src/
│   │   ├── chat/               # Real-time Socket.io crew chat
│   │   ├── components/         # Reusable UI widgets & modals
│   │   ├── context/            # Authentication & session context
│   │   ├── create-trip/        # AI trip creation form
│   │   ├── my-trips/           # User trip dashboard
│   │   ├── pages/              # Explore, Organiser, Profile, Auth
│   │   ├── service/            # Axios API & Gemini AI engine
│   │   └── view-trip/          # Interactive itinerary view & community
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API & WebSocket Server
│   ├── middleware/             # Auth & role-based middleware
│   ├── models/                 # Mongoose schemas (User, Trip, Booking, Message, Notification)
│   ├── routes/                 # REST endpoints (auth, trips, bookings, messages, organiser, users)
│   ├── index.js                # Server entry point & Socket.io handlers
│   └── package.json
│
├── UBIQUITOUS_LANGUAGE.md      # Domain-Driven Design specification
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18.x or v20.x+)
- **MongoDB** (Local instance or MongoDB Atlas cluster)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (or copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/travel-around
SESSION_SECRET=your_super_secret_session_key
NODE_ENV=development
```

Start the backend server:

```bash
# Production start
npm start

# Development with hot reload
npm run dev
```

The server runs on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in `client/` (or copy from `.env.example`):

```env
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_api_key_here
```

Start the frontend development server:

```bash
npm run dev
```

The client will be accessible at `http://localhost:5173`.

---

## 🔒 Authentication & Privacy Rules

- **Session Security**: Authentication is managed using server-side MongoDB-backed sessions with secure, `httpOnly` cookies.
- **Role-Based Access Control**:
  - **Traveler (`user`)**: Can create personal itineraries (private by default), join public community trips, and participate in approved group chats.
  - **Organiser (`organiser`)**: Can publish public trips with participant quotas, access the Organiser Management Dashboard (`/organiser`), review join requests, and moderate groups.
- **Privacy Enforcement**: Private traveler itineraries are accessible only to their creator.

---

## 📜 Available Scripts

### Root Directory
- Run client and server independently via `cd client && npm run dev` and `cd server && npm run dev`.

### Client
- `npm run dev` - Start Vite dev server
- `npm run build` - Compile production bundle
- `npm run lint` - Run ESLint checks

### Server
- `npm start` - Run Node.js production server
- `npm run dev` - Run nodemon development server
- `node test-db-connection.js` - Verify MongoDB connection

---

## 📄 License
ISC / Educational & Portfolio Use.
