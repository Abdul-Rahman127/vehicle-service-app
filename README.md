# 🚗 DriveX — Vehicle Service Booking System

<div align="center">

![DriveX](https://img.shields.io/badge/DriveX-Vehicle%20Service-DC2626?style=for-the-badge&logo=car&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

**A full-stack MERN vehicle service booking platform with admin dashboard, real-time booking management, and a cinematic dark-red UI.**

[🌐 Live Demo](https://vehicle-service-app-seven.vercel.app) · [🔧 API Health](https://endearing-energy-production.up.railway.app/) · [📋 Report Bug](https://github.com/Abdul-Rahman127/vehicle-service-app/issues)

</div>

---

## 📸 Preview

> DriveX — _Drive In. Drive Out. Drive Better._

A modern vehicle service booking system built for **Kandy, Sri Lanka**, featuring a cinematic dark-red aesthetic, smooth animations, and a fully functional admin dashboard.

---

## ✨ Features

### 👤 Customer Side
- 🏠 **Home Page** — Animated hero, stats counter, how-it-works steps
- 🔧 **Services** — Browse all available vehicle services with prices
- 📅 **Booking System** — Book a service with date, time, and vehicle info
- 📍 **Contact Page** — Contact form + embedded Google Maps
- ℹ️ **How It Works** — 5-step service process with visuals

### 🔐 Admin Dashboard
- 🔑 **JWT Authentication** — Secure admin login
- 📊 **Dashboard** — Live stats, recent bookings overview
- 📋 **Bookings Management** — View, update, filter all bookings
- ⏳ **Pending Bookings** — Manage incoming requests
- ✅ **Completed Bookings** — History of completed services
- 🛠️ **Services Management** — Add/Edit/Delete service categories
- 📬 **Contact Messages** — View customer inquiries
- 📈 **Reports** — Booking analytics
- ⚙️ **Settings** — Update business info

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Axios |
| **Styling** | CSS (custom dark-red cinematic theme) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Frontend Host** | Vercel |
| **Backend Host** | Railway |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Abdul-Rahman127/vehicle-service-app.git
cd vehicle-service-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/drivex
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `/frontend`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in Browser
```
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

---

## 🌐 Production Deployment

### Backend — Railway
1. Push code to GitHub
2. Connect repo on [railway.app](https://railway.app)
3. Set **Root Directory** to `/backend`
4. Add environment variables:
   ```
   MONGODB_URI=<your_atlas_uri>
   JWT_SECRET=<your_secret>
   NODE_ENV=production
   ```

### Frontend — Vercel
1. Connect repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://<your-railway-url>.up.railway.app/api
   ```

---

## 📁 Project Structure

```
vehicle-service-app/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection + seeding
│   ├── middleware/
│   │   └── auth.js             # JWT auth middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── ServiceCategory.js
│   │   ├── ContactMessage.js
│   │   ├── Notification.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── settingsRoutes.js
│   ├── utils/
│   │   └── fileStorage.js
│   ├── server.js               # Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── index.js        # Axios instance
    │   ├── assets/
    │   │   └── images/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── context/
    │   │   └── AppContext.jsx  # Global state (auth, etc.)
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Services.jsx
    │   │   ├── Booking.jsx
    │   │   ├── HowItWorks.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Login.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminBookings.jsx
    │   │   ├── AdminServices.jsx
    │   │   └── ...
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🔑 Default Admin Credentials

> ⚠️ Change these after first login!

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/services` | List all services |
| `POST` | `/api/bookings` | Create booking |
| `GET` | `/api/bookings` | Get all bookings (admin) |
| `PUT` | `/api/bookings/:id` | Update booking status |
| `POST` | `/api/contact` | Submit contact message |
| `GET` | `/api/contact` | Get all messages (admin) |
| `GET` | `/api/settings` | Get business settings |
| `PUT` | `/api/settings` | Update settings (admin) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Abdul Rahman**
- GitHub: [@Abdul-Rahman127](https://github.com/Abdul-Rahman127)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
Made with ❤️ for DriveX Vehicle Services, Kandy, Sri Lanka 🇱🇰
</div>
