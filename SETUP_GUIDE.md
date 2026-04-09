# 🎓 SETUP GUIDE - Hướng Dẫn Toàn Bộ Cài Đặt Thư Viện Gia Đình

## ✅ Pre-requisites Check

Trước khi bắt đầu, hãy kiểm tra bạn có:
- [ ] Máy tính với Windows/Mac/Linux
- [ ] Node.js v16+ đã cài ([tải tại nodejs.org](https://nodejs.org))
- [ ] Git đã cài ([tải tại git-scm.com](https://git-scm.com))
- [ ] Tài khoản GitHub (để deploy)
- [ ] Mã code project này

---

## 📋 STEP-BY-STEP GUIDE

### STEP 1: Tổng Quan Project

```
Thuvien/
├── backend/          ← Node.js + Express Server
├── frontend/         ← React App (Giao diện)
└── Configuration files
```

**Backend** chạy trên port **5000**  
**Frontend** chạy trên port **3000**

---

### STEP 2: Cài Đặt Dependencies (Lần Đầu)

#### Option A: Tự động (Recommended)
```bash
# Windows - chạy file này:
setup.bat

# Mac/Linux - chạy file này:
bash setup.sh
```

#### Option B: Manual
```bash
# 2.1 Setup Backend
cd backend
npm install
cp .env.example .env

# 2.2 Setup Frontend (terminal mới)
cd frontend
npm install  
cp .env.example .env
```

---

### STEP 3: Cấu Hình MongoDB

#### 3.1 Tạo Tài Khoản MongoDB Atlas
1. Truy cập https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up for Free"**
3. Điền email, password
4. Verify email

#### 3.2 Tạo Cluster
1. Click **"Create"** (tạo cluster mới)
2. Chọn **"FREE"** tier
3. Chọn region gần bạn (ví dụ: Singapore)
4. Click **"Create Cluster"** → Đợi ~5 phút

#### 3.3 Lấy Connection String
1. Trong cluster, click **"Connect"**
2. Chọn **"Drivers"**
3. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/thuvien?retryWrites=true&w=majority
   ```

#### 3.4 Cập Nhật .env
```bash
# backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thuvien?retryWrites=true&w=majority
```

---

### STEP 4: Cấu Hình JWT Secret

```bash
# backend/.env
JWT_SECRET=xBc9QmKpL2WnRsT5UvYzFgHjIaKdEfGhJlMnOpQrStUvWxYz

# (Sinh random string theo link này: https://www.uuidgenerator.net/)
```

---

### STEP 5: Cấu Hình Mật Khẩu Gia Đình

```bash
# backend/.env
ADMIN_PASSWORD=giadinh    # ← Thay bằng mật khẩu của bạn!
ADMIN_USERNAME=admin
```

---

### STEP 6: Khởi Động Local Development

#### Terminal 1: Backend
```bash
cd backend
npm run dev

# Output sẽ hiển thị:
# ╔════════════════════════════╗
# ║   📚 Thư Viện Gia Đình    ║
# ║   ✅ Server port 5000      ║
# ╚════════════════════════════╝
```

#### Terminal 2: Frontend  
```bash
cd frontend
npm run dev

# Output sẽ hiển thị:
# ➜  Local:   http://localhost:3000/
```

#### Kiểm Tra
- Mở browser: http://localhost:3000
- Nhập tên: "Bé Na"
- Nhập mật khẩu: "giadinh"
- Bấm "Mở cửa tủ sách"

✅ Nếu thành công → Tiếp tục STEP 7

---

### STEP 7: Testing Features

#### 7.1 Test Readers (Người dùng bình thường)
- [x] Login/Logout
- [x] Xem tủ sách
- [x] Mở truyện
- [x] Thêm reaction (tim, like, smile)
- [x] Bình luận

#### 7.2 Test Admin (nếu có)
- [ ] Admin Panel access
- [ ] Thêm truyện mới
- [ ] Chỉnh sửa truyện
- [ ] Xóa truyện

---

### STEP 8: Chuẩn Bị Deploy

#### 8.1 Tạo GitHub Repository
```bash
# Trong thư mục Thuvien:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thuvien.git
git push -u origin main
```

#### 8.2 Frontend Deploy (Vercel)

**Tạo tài khoản:**
1. Truy cập https://vercel.com
2. Click **"Sign Up"**
3. Chọn **"GitHub"**
4. Authorize Vercel

**Deploy:**
1. Click **"New Project"**
2. Chọn repository `thuvien`
3. Framework: **Next.js** (hoặc Vite)
4. Root Directory: **./frontend**
5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.render.com/api
   ```
   *(Sẽ update sau khi có backend URL)*
6. Click **"Deploy"**

✅ Frontend sẽ được deploy tại: `https://your-project.vercel.app`

#### 8.3 Backend Deploy (Render)

**Tạo tài khoản:**
1. Truy cập https://render.com
2. Click **"Sign Up"**
3. Chọn **"GitHub"**

**Deploy:**
1. Click **"New +"** → **"Web Service"**
2. Kết nối repository `thuvien`
3. Cấu hình:
   ```
   Name: thuvien-backend
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```
4. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=xBc9Qm...
   ADMIN_PASSWORD=giadinh
   CLIENT_URL=https://your-project.vercel.app
   NODE_ENV=production
   PORT=5000
   ```
5. Click **"Create Web Service"**

✅ Backend sẽ được deploy tại: `https://your-backend.render.com`

#### 8.4 Update Frontend URL
1. Truy cập Vercel project settings
2. Environment Variables
3. Update `VITE_API_URL=https://your-backend.render.com/api`
4. Redeploy (GitHub push tự động trigger)

---

### STEP 9: Testing Production

```
Truy cập: https://your-project.vercel.app
Nhập tên + mật khẩu (như local)
```

Nếu lỗi → Kiểm tra:
- [ ] Backend URL đúng trong VITE_API_URL
- [ ] MongoDB URI đúng
- [ ] JWT_SECRET giống nhau
- [ ] ADMIN_PASSWORD đúng

---

## 🎯 Quicker Checklist

- [ ] Cài Node.js + Git
- [ ] Setup backend dependencies + .env
- [ ] Setup frontend dependencies + .env
- [ ] MongoDB Atlas account + cluster
- [ ] Test local (localhost:3000)
- [ ] Push GitHub
- [ ] Deploy Frontend (Vercel)
- [ ] Deploy Backend (Render)
- [ ] Test production URL

---

## 🚨 Common Issues & Fixes

### ❌ MongoDB Connection Error
**Error:** `Cannot connect to MongoDB`
**Fix:**
1. Kiểm tra MONGODB_URI đúng: `mongodb+srv://username:password@...`
2. Verify password không có kí tự đặc biệt (hoặc URL encode)
3. MongoDB Atlas → Network Access → Add IP 0.0.0.0/0

### ❌ CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS`
**Fix:**
1. backend/.env: `CLIENT_URL=http://localhost:3000`
2. Sau deploy: `CLIENT_URL=https://your-vercel-url`

### ❌ Token Invalid
**Error:** `401 Unauthorized`
**Fix:**
1. Clear browser: F12 → Application → Clear cookies/storage
2. Đăng nhập lại
3. Check JWT_SECRET giống nhau backend + frontend

### ❌ Stories Not Showing
**Error:** Tủ sách trống
**Fix:**
1. Check MongoDB có data không? → Use MongoDB Compass
2. Frontend console (F12) có lỗi gì không?
3. Check backend logs

---

## 📞 Support Resources

- **Error Details:** Check browser console (F12)
- **Backend Logs:** Terminal backend
- **MongoDB:** MongoDB Compass hoặc Atlas UI
- **Deployment:** Vercel/Render dashboard

---

## ✨ Next Steps (Optional)

- [ ] Add stories từ admin panel
- [ ] Setup Google Drive PDF viewer
- [ ] Custom domain (Vercel)
- [ ] Email notifications
- [ ] Dark mode
- [ ] Multiple languages

---

## 🎉 Nếu Thành Công!

```
✅ Frontend: https://your-project.vercel.app
✅ Backend: https://your-backend.render.com
✅ Database: MongoDB Atlas
✅ Live! 🚀
```

Hãy chia sẻ link với gia đình để họ thử! 👨‍👩‍👧‍👦

---

*Hướng dẫn này được cập nhật lần cuối: 2024*
