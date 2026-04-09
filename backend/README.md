# Thư Viện Gia Đình 📚

Hệ thống thư viện truyện số cho gia đình, được thiết kế để các bé có thể đọc, nghe và tương tác với các truyện cổ tích Việt Nam cũng như các truyện quốc tế.

## ✨ Features

- 🔐 **Đăng nhập bảo mật** - Mật khẩu gia đình (không có tính năng đăng ký công khai)
- 📚 **Thư viện truyện** - Hiển thị danh sách truyện dưới dạng grid
- 📖 **Đọc truyện** - Giao diện đẹp để đọc nội dung truyện
- 🎵 **Phát âm thanh** - Nghe truyện được đọc (audio player)
- 👍 **Thả cảm xúc** - Like, Tim, Smile reactions
- 💬 **Bình luận** - Các bé có thể bình luận về truyện
- 🎛️ **Admin Panel** - Thêm/chỉnh sửa/xóa truyện
- ☁️ **Cloud Storage** - Lưu trữ file trên Google Drive
- 📱 **Responsive Design** - Hoạt động trên desktop, tablet, mobile

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Vite
- Lucide React Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Google Drive API

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📦 Installation

### Yêu cầu
- Node.js 16+
- npm hoặc yarn
- Git

### Local Setup

```bash
# Clone repository
git clone <your-repo-url>
cd Thuvien

# Backend
cd backend
npm install
cp .env.example .env
# Cập nhật .env với MongoDB URI, JWT_SECRET, etc.
npm run dev

# Frontend (terminal mới)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Truy cập http://localhost:3000

## 🚀 Deployment

Xem hướng dẫn chi tiết trong [README.md](./README.md) hoặc [DEPLOYMENT.json](./DEPLOYMENT.json)

### Quick Deploy
1. **Backend**: Push lên GitHub → Deploy trên Render
2. **Frontend**: Push lên GitHub → Deploy trên Vercel

## 📖 API Documentation

### Auth Endpoints
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify` - Xác thực token

### Stories Endpoints
- `GET /api/stories` - Lấy danh sách
- `GET /api/stories/:id` - Chi tiết truyện
- `POST /api/stories` - Tạo (admin)
- `PUT /api/stories/:id` - Cập nhật (admin)
- `PUT /api/stories/:id/react` - Thêm reaction
- `DELETE /api/stories/:id` - Xóa (admin)

### Comments Endpoints
- `GET /api/comments/:storyId` - Lấy bình luận
- `POST /api/comments` - Tạo bình luận
- `DELETE /api/comments/:id` - Xóa bình luận

## 🔒 Security

- JWT Token-based authentication
- Family password protection only
- No public signup available
- CORS protection
- MongoDB encryption

## 📱 Usage

### Người dùng bình thường
1. Truy cập app
2. Nhập tên + mật khẩu gia đình
3. Duyệt danh sách truyện
4. Click vào truyện để đọc
5. Bình luận và thả reaction

### Admin
1. Đăng nhập → bấm Admin button
2. Điền form thêm truyện
3. Click "Thêm Truyện"
4. Quay lại để xem truyện mới

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Kiểm tra MONGODB_URI và Network Access
- **CORS Error**: Kiểm tra CLIENT_URL trong backend .env
- **Token Invalid**: Clear localStorage và đăng nhập lại
- **Stories Not Loading**: Kiểm tra backend server có chạy không

## 📸 Screenshots

[Thêm screenshots ở đây]

## 💡 Future Enhancements

- [ ] PDF viewer cho file truyện
- [ ] Rating/Review system
- [ ] Bookmark favorite stories
- [ ] Reading progress tracking
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Push notifications

## 📄 License

MIT License - Feel free to use and modify

## 👨‍👩‍👧‍👦 Author

Xây dựng với ❤️ cho gia đình

---

**Hãy chia sẻ hành trình đọc sách của các em! 📖✨**
