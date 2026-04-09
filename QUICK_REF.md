# 📋 QUICK REFERENCE CARD

## Ports & URLs

| Service | Local | Production |
|---------|-------|-----------|
| Frontend | http://localhost:3000 | `https://xyz.vercel.app` |
| Backend | http://localhost:5000 | `https://xyz.render.com` |
| API | /api/* | `https://xyz.render.com/api/*` |

---

## File Locations

| Purpose | Path |
|---------|------|
| Backend Setup | `backend/.env` |
| Frontend Setup | `frontend/.env` |
| MongoDB Scheme | `backend/src/models/` |
| API Routes | `backend/src/routes/` |
| React Pages | `frontend/src/pages/` |

---

## Commands

### Setup (First Time)
```bash
# Windows
setup.bat

# Mac/Linux  
bash setup.sh
```

### Development
```bash
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

### Build for Production
```bash
cd backend && npm start
cd frontend && npm run build
```

### Install Dependencies  
```bash
cd backend && npm install
cd frontend && npm install
```

---

## Environment Variables

### Backend Required
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-key-here
ADMIN_PASSWORD=giadinh  
CLIENT_URL=http://localhost:3000
PORT=5000
```

### Frontend Required
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Default Credentials

| Field | Value |
|-------|-------|
| Username | Any (e.g., "Bé Na") |
| Password | `giadinh` |
| Admin Role | Set in MongoDB |

---

## API Quick Reference

```
POST   /api/auth/login              → Get JWT token
POST   /api/auth/verify              → Verify token
GET    /api/stories                  → List all stories
GET    /api/stories/:id              → Get story details
POST   /api/stories                  → Create story (admin)
PUT    /api/stories/:id/react        → Add reaction
GET    /api/comments/:storyId        → Get comments
POST   /api/comments                 → Add comment
```

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| MongoDB not connecting | Check MONGODB_URI + whitelist IP |
| CORS errors | Update CLIENT_URL in backend |
| Token invalid | `localStorage.clear()` + re-login |
| Stories empty | Check MongoDB has data |
| API not responding | Check backend is running |

---

## Deployment Checklist

- [ ] JWT_SECRET configured (not default)
- [ ] ADMIN_PASSWORD secured
- [ ] MongoDB URI correct
- [ ] Frontend API URL correct
- [ ] GitHub repo set up
- [ ] Vercel project created  
- [ ] Render project created
- [ ] Environment vars added
- [ ] Local testing passed
- [ ] Deployed & tested

---

## File Structure Map

```
Thuvien/
├── 📖 README.md                (Project overview)
├── 📚 SETUP_GUIDE.md           (Follow this first!)
├── 📊 PROJECT_SUMMARY.md       (What was built)
├── 📋 QUICK_REF.md             (This file)
│
├── backend/
│   ├── src/
│   │   ├── routes/ → API endpoints
│   │   ├── models/ → MongoDB schemas
│   │   ├── middleware/ → Auth & errors
│   │   └── config/ → Database & Google
│   ├── package.json
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/ → React components
    │   ├── utils/ → API client
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    ├── .env.example
    └── index.html
```

---

## MongoDB Collections

```javascript
Users
├── _id: ObjectId
├── username: String
├── password: String (hashed)
└── role: "admin" | "viewer"

Stories
├── _id: ObjectId  
├── title: String
├── author: String
├── cover: String (URL)
├── content: String
├── audioLink: String (optional)
├── reactions: { like, heart, smile }
└── createdAt: Date

Comments
├── _id: ObjectId
├── storyId: ObjectId (ref Story)
├── userName: String
├── text: String
└── createdAt: Date
```

---

## Common Paths Reference

### Backend Add New Route
```javascript
// File: backend/src/routes/new.js
import express from 'express';
const router = express.Router();
// Add routes...
export default router;

// File: backend/src/server.js (add this line)
app.use('/api/new', newRoutes);
```

### Frontend Add New Page
```javascript
// File: frontend/src/pages/NewPage.jsx
export default function NewPage({ prop1, prop2 }) {
  return <div>...</div>;
}

// File: frontend/src/App.jsx (import & use)
```

---

## Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <url>
git push -u origin main

# Regular updates
git add .
git commit -m "Description"
git push

# View logs
git log --oneline
git status
```

---

## Useful Links

- **Node.js**: https://nodejs.org
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **Tailwind CSS**: https://tailwindcss.com
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com

---

## Need Help?

1. **Check console errors** (F12 in browser)
2. **Check backend logs** (terminal running npm run dev)
3. **Read SETUP_GUIDE.md** (troubleshooting section)
4. **Check MongoDB Atlas** (data import/export)
5. **Verify .env files** (correct values)

---

**Print this page for quick reference! 🖨️**
