# 📚 Thư Viện Gia Đình - System Complete Setup Guide

## 🎯 Tổng Quan Hệ Thống

Hệ thống "Thư viện gia đình" bao gồm:
- **Frontend**: React 18 + Tailwind CSS (Vercel)
- **Backend**: Node.js + Express + MongoDB (Render)
- **Database**: MongoDB Atlas
- **Storage**: Google Drive API

---

## 🚀 Hướng Dẫn Cài Đặt Chi Tiết

### Phase 1: Chuẩn Bị Tài Khoản

#### 1.1 MongoDB Atlas Setup
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo tài khoản miễn phí
3. Tạo Cluster (chọn tier Free)
4. Lấy Connection String: `mongodb+srv://username:password@cluster.mongodb.net/thuvien`

#### 1.2 Google Drive API Setup (Tùy chọn)
1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới
3. Enable Google Drive API
4. Tạo Service Account Key (JSON file)
5. Lưu key vào file `.env`

---

### Phase 2: Local Development

#### 2.1 Backend Setup
\`\`\`bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Cập nhật các giá trị trong .env:
# - MONGODB_URI
# - JWT_SECRET (đặt một chuỗi random dài)
# - ADMIN_PASSWORD (mật khẩu gia đình)
# - CLIENT_URL

# Khởi động server development
npm run dev

# Server sẽ chạy trên http://localhost:5000
\`\`\`

#### 2.2 Frontend Setup
\`\`\`bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Giữ nguyên VITE_API_URL=http://localhost:5000/api

# Khởi động dev server
npm run dev

# App sẽ mở tại http://localhost:3000
\`\`\`

---

### Phase 3: Testing Local

#### 3.1 Test Login
1. Truy cập http://localhost:3000
2. Nhập tên bé (ví dụ: "Bé Na")
3. Nhập mật khẩu: `giadinh` (hoặc giá trị trong .env)
4. Bấm "Mở cửa tủ sách"

#### 3.2 Test Admin Panel (tùy chọn)
- Nếu muốn test admin, cập nhật trong `/backend/.env`:
  \`\`\`
  ADMIN_PASSWORD=giadinh
  ADMIN_USERNAME=admin
  \`\`\`
- Thay role='viewer' thành role='admin' trong MongoDB hoặc code

#### 3.3 Thêm Stories Mẫu
Chạy script seed data (optional):
\`\`\`bash
# Tạo file /backend/src/scripts/seedData.js
# Chạy: node src/scripts/seedData.js
\`\`\`

---

### Phase 4: Build & Deployment

#### 4.1 Frontend Deployment (Vercel)
\`\`\`bash
# 1. Push code lên GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Truy cập https://vercel.com
# 3. Import GitHub repository
# 4. Chọn folder: frontend
# 5. Environment Variables:
#    VITE_API_URL=https://your-backend.render.com/api

# 6. Bấm Deploy
# Vercel sẽ tự động deploy khi có push mới
\`\`\`

#### 4.2 Backend Deployment (Render)
\`\`\`bash
# 1. Push full repo lên GitHub (nếu chưa)

# 2. Truy cập https://render.com
# 3. Tạo New -> Web Service
# 4. Kết nối GitHub repo
# 5. Cấu hình:
#    - Name: thuvien-backend
#    - Root Directory: backend
#    - Build Command: npm install
#    - Start Command: node src/server.js
#    - Environment Variables:
#      * MONGODB_URI=mongodb+srv://...
#      * JWT_SECRET=your-secret-key
#      * ADMIN_PASSWORD=giadinh
#      * CLIENT_URL=https://your-vercel-url.vercel.app
#      * NODE_ENV=production
#      * PORT=5000

# 6. Bấm Create Web Service
\`\`\`

---

## 📋 API Endpoints

### Authentication
- **POST** `/api/auth/login` - Đăng nhập
  \`\`\`json
  {
    "username": "Bé Na",
    "password": "giadinh"
  }
  \`\`\`
  Response: \`{ token, user }\`

### Stories
- **GET** `/api/stories` - Lấy danh sách truyện
- **GET** `/api/stories/:id` - Chi tiết truyện
- **POST** `/api/stories` - Tạo truyện (Admin only)
- **PUT** `/api/stories/:id` - Cập nhật truyện (Admin only)
- **PUT** `/api/stories/:id/react` - Thêm reaction
- **DELETE** `/api/stories/:id` - Xóa truyện (Admin only)

### Comments
- **GET** `/api/comments/:storyId` - Lấy bình luận
- **POST** `/api/comments` - Tạo bình luận
- **DELETE** `/api/comments/:id` - Xóa bình luận

---

## 🔐 Security Checklist

- [ ] Đổi JWT_SECRET thành chuỗi random dài
- [ ] Đổi ADMIN_PASSWORD thành mật khẩu an toàn
- [ ] Không commit file `.env` (thêm vào `.gitignore`)
- [ ] Bật CORS chỉ cho domain của bạn
- [ ] Kiểm tra MongoDB Network Access
- [ ] Bật SSL/TLS trong MongoDB
- [ ] Dùng HTTPS cho production URL

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to MongoDB"
- Kiểm tra MONGODB_URI có đúng không
- Whitelist IP address trong MongoDB Atlas
- Kiểm tra mật khẩu có kí tự đặc biệt

### Lỗi: "CORS error"
- Kiểm tra CLIENT_URL trong .env backend
- Refresh browser (clear cache)
- Kiểm tra terminal có lỗi nào không

### Lỗi: "Token invalid"
- Clear localStorage: \`localStorage.clear()\`
- Đăng nhập lại
- Kiểm tra JWT_SECRET giống nhau trên backend

---

## 📁 Project Structure

\`\`\`
Thuvien/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── stories.js
│   │   │   └── comments.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Story.js
│   │   │   └── Comment.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── googleDrive.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LibraryPage.jsx
│   │   │   ├── ReaderPage.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── utils/
│   │   │   └── apiClient.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
├── README.md
└── DEPLOYMENT.json
\`\`\`

---

## 🎓 Next Steps

1. ✅ Clone/Download project
2. ✅ Cài đặt MongoDB Atlas
3. ✅ Cài đặt dependencies (backend + frontend)
4. ✅ Chạy local development
5. ✅ Test tất cả features
6. ✅ Deploy lên Vercel + Render
7. ✅ Thêm stories vào admin panel
8. ✅ Share link với gia đình

---

## 📞 Support

Nếu gặp lỗi, hãy:
1. Kiểm tra console (F12 trong browser)
2. Kiểm tra terminal backend
3. Kiểm tra logs trên Render/Vercel
4. Đọc lại phần Troubleshooting

---

**Happy Reading! 📖 Chúc các em học tốt! 🎉**
