# PaperlessDoc — Full MERN Stack Digital Document Locker

> **“All your important documents in one secure, organized place.”**

PaperlessDoc is a production-grade, secure personal document-management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It enables users—including students, medical professionals, working individuals, and general users—to upload, organize, search, preview, download, share, and manage their vital personal documents securely.

---

## 🌟 Key Features

* **Strict Data Isolation**: Every document query and API endpoint is strictly authenticated and scoped to the logged-in user.
* **No Dummy Data Guarantee**: Clean empty states render dynamically when a database or folder is empty. All counts, category tallies, storage calculations, and expiring lists are computed live from user records.
* **Onboarding Wizard**: 3-step personalized setup flow for categories, notifications, and security preferences.
* **Modern SaaS Design**: Deep navy themes, glassmorphism, responsive navigation (desktop fixed sidebar + mobile bottom navigation bar).
* **Document Management**:
  * Multi-format support: PDF, JPG, JPEG, PNG, WEBP (up to 10MB per file).
  * Category tagging: Education, Identity, Medical, Career, Financial, Other, plus custom user-created folders.
  * Starred / Important documents list.
  * Issue & Expiry date management with automatic expiry threshold alerts.
  * Drag-and-drop file upload with progress bar.
* **Secure Sharing**:
  * Un-guessable 64-character token share links (`/public/share/:token`).
  * Configurable link expiration (7 days, 30 days, custom date, or never).
  * One-click link revocation.
* **Recycle Bin (Trash)**: Soft delete support with restore and permanent file destruction capabilities.
* **Profile & Settings**: Profile updates, password changes, live storage breakdown meter, notification toggles, and multi-step account deletion confirmation.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Vite build system)
* **Tailwind CSS v4** (Modern SaaS design system)
* **Lucide React** (Clean icons)
* **React Router v6** (Protected and public route management)
* **Axios** (JWT interceptor & REST API client)

### Backend
* **Node.js** & **Express.js** (RESTful API server)
* **MongoDB Atlas** & **Mongoose** (Database & schema modeling)
* **JWT (JSON Web Tokens)** & **bcryptjs** (Secure authentication & password hashing)
* **Multer** (Disk file storage handling)
* **Helmet** & **CORS** (Security headers)

---

## 📁 Project Structure

```text
paperlessdoc/
├── client/                   # Vite React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI (Sidebar, TopNav, BottomNav, DocumentCard, Modals, EmptyState)
│   │   ├── context/          # AuthContext & ToastContext
│   │   ├── pages/            # Landing, Login, Signup, Onboarding, Dashboard, Documents, Detail, Upload, Categories, Important, Shared, Trash, Profile, PublicShare
│   │   ├── services/         # Axios API configuration
│   │   ├── App.jsx           # Main routing & protected guards
│   │   └── index.css         # Tailwind CSS & global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Express Backend API
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Auth, Document, Category, Share, Notification controllers
│   ├── middleware/           # JWT Auth, Multer Upload, ErrorHandler
│   ├── models/               # User, Document, Category, ShareLink, Notification schemas
│   ├── routes/               # API route definitions
│   ├── uploads/              # Secure physical file storage directory
│   ├── server.js             # Main server entry point
│   ├── package.json
│   └── .env.example          # Environment variable template
│
├── .env                      # Root environment configuration
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` inside `server/.env` (and root `.env` if desired):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/paperlessdoc
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> ⚠️ **Security Warning**: Never commit real database credentials or secrets to Git or expose them in client-side code.

---

## 🚀 Running Locally

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev   # Runs Express server on http://localhost:5000
```

### 2. Start the Frontend Application

```bash
cd client
npm install
npm run dev   # Runs Vite server on http://localhost:5173
```

Open `http://localhost:5173` in your browser to access **PaperlessDoc**.

---

## 🔒 Security & Privacy Architecture

1. **User Isolation**: All document queries verify `document.userId === req.user.id`. User A cannot access or view User B's documents.
2. **Secure Token Shares**: Share URLs utilize cryptographically random tokens (`crypto.randomBytes(32).toString('hex')`) instead of MongoDB ObjectIDs.
3. **Password Security**: Passwords are hashed using `bcryptjs` with salt factor 10.
4. **File Storage**: Uploaded files are stored securely on disk and streamed only to authenticated owners or valid share link holders.
