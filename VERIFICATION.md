# ✅ VERIFICATION CHECKLIST

Use this checklist to verify that your project is set up correctly.

---

## 📁 Directory Structure Verification

Backend Files:
- [ ] `backend/package.json` - Dependencies defined
- [ ] `backend/.env.example` - Template for .env
- [ ] `backend/src/server.js` - Main server
- [ ] `backend/src/config/database.js` - MongoDB config
- [ ] `backend/src/models/User.js` - User model
- [ ] `backend/src/models/Story.js` - Story model
- [ ] `backend/src/models/Comment.js` - Comment model
- [ ] `backend/src/middleware/auth.js` - JWT middleware
- [ ] `backend/src/routes/auth.js` - Auth routes
- [ ] `backend/src/routes/stories.js` - Story routes
- [ ] `backend/src/routes/comments.js` - Comment routes

Frontend Files:
- [ ] `frontend/package.json` - Dependencies defined
- [ ] `frontend/.env.example` - Template for .env
- [ ] `frontend/index.html` - HTML template
- [ ] `frontend/src/main.jsx` - React entry point
- [ ] `frontend/src/App.jsx` - Main App component
- [ ] `frontend/src/index.css` - Tailwind styles
- [ ] `frontend/src/utils/apiClient.js` - API client
- [ ] `frontend/src/pages/LoginPage.jsx` - Login page
- [ ] `frontend/src/pages/LibraryPage.jsx` - Library page
- [ ] `frontend/src/pages/ReaderPage.jsx` - Reader page
- [ ] `frontend/src/pages/AdminPanel.jsx` - Admin panel

Configuration Files:
- [ ] `README.md` - Main documentation
- [ ] `SETUP_GUIDE.md` - Setup instructions
- [ ] `PROJECT_SUMMARY.md` - Project overview
- [ ] `QUICK_REF.md` - Quick reference
- [ ] `DEPLOYMENT.json` - Deployment info
- [ ] `.gitignore` - Git ignore rules
- [ ] `setup.sh` - Mac/Linux setup script
- [ ] `setup.bat` - Windows setup script

---

## 🔧 Backend Configuration

### environment Variables Check
- [ ] Created `backend/.env` from `.env.example`
- [ ] MONGODB_URI is set
- [ ] JWT_SECRET is set to a random string
- [ ] ADMIN_PASSWORD is set
- [ ] CLIENT_URL is set to `http://localhost:3000`
- [ ] PORT is set to `5000`
- [ ] NODE_ENV is set to `development`

### Dependencies Check
- [ ] `npm install` completed without errors
- [ ] `node_modules/` folder exists
- [ ] All packages from `package.json` installed

### Server Verification
- [ ] `npm run dev` starts without errors
- [ ] Server listens on port 5000
- [ ] Logs show "✅ MongoDB Connected" or similar
- [ ] No console errors

---

## 🎨 Frontend Configuration

### Environment Variables Check
- [ ] Created `frontend/.env` from `.env.example`
- [ ] VITE_API_URL is set to `http://localhost:5000/api`

### Dependencies Check
- [ ] `npm install` completed without errors
- [ ] `node_modules/` folder exists
- [ ] All packages from `package.json` installed

### Development Server
- [ ] `npm run dev` starts without errors
- [ ] Server starts on port 3000
- [ ] Browser opens automatically or manual visit works
- [ ] CSS/styling loads correctly
- [ ] No console errors

---

## 🗄️ MongoDB Setup

- [ ] MongoDB Atlas account created
- [ ] Cluster created (Free tier)
- [ ] Connection string copied
- [ ] Connection string pasted in `backend/.env`
- [ ] IP whitelist enabled (0.0.0.0/0 or your IP)
- [ ] Can connect from backend (no connection errors)

---

## 🧪 Feature Testing (Local)

### Login Feature
- [ ] Can access http://localhost:3000
- [ ] Login form displays
- [ ] Can enter username
- [ ] Can enter password
- [ ] Can click login button
- [ ] Redirects to library page after login

### Library Feature
- [ ] Library page displays
- [ ] Stories show as cards (or empty if first time)
- [ ] User name shown in header
- [ ] Can click on story card
- [ ] Redirects to reader page

### Reader Feature
- [ ] Story title displays
- [ ] Story cover image shows
- [ ] Story content displays
- [ ] Audio player works (if audioLink exists)
- [ ] Can click reaction buttons (like, heart, smile)
- [ ] Reaction count increases
- [ ] Can type in comment box
- [ ] Can submit comment
- [ ] Comment appears in list
- [ ] Can see comment author name
- [ ] Can delete own comments

### Admin Feature (optional)
- [ ] Admin button visible (if admin role)
- [ ] Admin panel page loads
- [ ] Form fields display
- [ ] Can fill in form
- [ ] Can submit form
- [ ] New story appears in library after submit

### Logout Feature
- [ ] Logout button accessible
- [ ] Clicking logout redirects to login
- [ ] Token cleared from browser storage
- [ ] Can login again

---

## 🔒 Security Checks

- [ ] JWT_SECRET is not "your-secret" (changed to random)
- [ ] ADMIN_PASSWORD is not "giadinh" (can be, but recommended to change)
- [ ] `.env` file is (added to .gitignore)
- [ ] No `.env` file in git history
- [ ] Passwords are hashed in database
- [ ] Token validation on protected routes

---

## 📦 API Testing (Using Postman or similar)

### Health Check
- [ ] `GET /api/health` returns status

### Auth Endpoints
- [ ] `POST /api/auth/login` with valid credentials returns token
- [ ] `POST /api/auth/login` with invalid password returns 401
- [ ] `POST /api/auth/verify` with valid token returns valid: true
- [ ] `POST /api/auth/verify` with invalid token returns valid: false

### Stories Endpoints
- [ ] `GET /api/stories` requires auth (401 without token)
- [ ] `GET /api/stories` returns array of stories
- [ ] `GET /api/stories/:id` returns specific story
- [ ] `PUT /api/stories/:id/react` updates reaction count

### Comments Endpoints
- [ ] `GET /api/comments/:storyId` returns comments array
- [ ] `POST /api/comments` creates comment (requires auth)
- [ ] Comment appears in GET list after creation

---

## 🚀 Deployment Readiness

### Code Quality
- [ ] No console.log debugging statements left
- [ ] No TODO comments left
- [ ] No commented-out code
- [ ] Proper error handling implemented
- [ ] All function names are descriptive

### Configuration
- [ ] All .env files are configured
- [ ] CORS origin set correctly
- [ ] API URL updated for production
- [ ] JWT_SECRET is production-grade
- [ ] MongoDB credentials are correct

### Documentation
- [ ] README.md is complete
- [ ] SETUP_GUIDE.md is clear
- [ ] Comments in code explain complex logic
- [ ] API endpoints documented

### Git Readiness  
- [ ] `.gitignore` excludes node_modules
- [ ] `.gitignore` excludes `.env` files
- [ ] `.env` not committed to git
- [ ] All source files committed
- [ ] Meaningful commit history

---

## ⚠️ Known Issues to Watch For

- [ ] No CORS errors in browser console
- [ ] No "Cannot GET /api/..." errors
- [ ] No JWT validation failures
- [ ] No MongoDB connection timeouts
- [ ] No duplicate key errors in MongoDB

---

## 🆘 If Something Fails

### Backend Won't Start
- [ ] Check Node.js is installed: `node --version`
- [ ] Check npm is installed: `npm --version`
- [ ] Check MongoDB MONGODB_URI is correct
- [ ] Check all required env vars are set
- [ ] Check no other process is using port 5000
- [ ] Delete `node_modules/` and `npm install` again

### Frontend Won't Start
- [ ] Check Node.js is installed
- [ ] Check npm is installed
- [ ] Check API URL in .env is correct
- [ ] Check backend is running first
- [ ] Check no other process is using port 3000
- [ ] Delete `node_modules/` and `npm install` again

### Login Fails
- [ ] Check backend console for errors
- [ ] Check browser F12 console for errors
- [ ] Verify ADMIN_PASSWORD in .env matches what you entered
- [ ] Check MongoDB user exists
- [ ] Clear localStorage: `localStorage.clear()`

### API Calls Fail
- [ ] Check backend is running (`npm run dev`)
- [ ] Check API URL in frontend .env is correct
- [ ] Check CORS is enabled in backend
- [ ] Check MongoDB connection is working
- [ ] Check JWT token is being sent in requests

---

## 📊 Final Checklist

- [ ] All files created ✅
- [ ] Backend configured ✅
- [ ] Frontend configured ✅
- [ ] MongoDB set up ✅
- [ ] Local development working ✅
- [ ] All features tested ✅
- [ ] Ready for deployment 🚀

---

## ✨ Success Indicators

You know everything is working when:
1. ✅ Backend starts with "Server running on port 5000"
2. ✅ Frontend loads at http://localhost:3000
3. ✅ Can login with any username and password "giadinh"
4. ✅ Library page shows (might be empty on first run)
5. ✅ Can add reactions and comments
6. ✅ Browser console shows no errors
7. ✅ Backend terminal shows API requests

---

**🎉 If all checkboxes are checked, you're ready to deploy!**

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for deployment instructions.
