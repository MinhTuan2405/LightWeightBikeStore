# 🚀 HƯỚNG DẪN DEPLOY LÊN VERCEL + RAILWAY

## Tổng quan

- **Frontend (React)**: Deploy lên **Vercel** (miễn phí)
- **Backend (FastAPI)**: Deploy lên **Railway** (có free tier)
- **Database (PostgreSQL)**: Tạo trên **Railway**

---

## PHẦN 1: DEPLOY BACKEND LÊN RAILWAY

### Bước 1: Đăng ký Railway

1. Vào https://railway.app
2. Click **"Login"** → Chọn **"Login with GitHub"**
3. Cho phép Railway truy cập GitHub

### Bước 2: Tạo Project mới

1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Tìm và chọn repo **LightWeightBikeStore**
4. Chọn branch **tung-new-4** (hoặc main)

### Bước 3: Cấu hình Root Directory

⚠️ **QUAN TRỌNG**: Backend nằm trong thư mục `src`

1. Vào **Settings** của service
2. Tìm **"Root Directory"**
3. Nhập: `src`

### Bước 4: Thêm PostgreSQL Database

1. Trong project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway tự động tạo database và cung cấp `DATABASE_URL`

### Bước 5: Cấu hình Environment Variables

Vào **Variables** tab, thêm các biến sau:

```
DATABASE_URL = (Railway tự động thêm từ PostgreSQL)
SECRET_KEY = your-super-secret-key-change-this-in-production
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ALLOWED_ORIGINS = https://your-frontend.vercel.app
```

### Bước 6: Deploy

1. Railway sẽ tự động detect Python và build
2. Đợi deploy xong (2-5 phút)
3. Click **"Generate Domain"** để có URL public
4. **Lưu lại URL này** (ví dụ: `https://lightweightbikestore-production.up.railway.app`)

### Bước 7: Tạo Database Tables

Sau khi deploy xong, vào tab **"Deploy Logs"** hoặc dùng Railway CLI:

```bash
# Chạy migration (nếu có)
alembic upgrade head

# Hoặc tạo admin user
python create_admin.py
```

---

## PHẦN 2: DEPLOY FRONTEND LÊN VERCEL

### Bước 1: Đăng ký Vercel

1. Vào https://vercel.com
2. Click **"Sign Up"** → **"Continue with GitHub"**

### Bước 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Tìm repo **LightWeightBikeStore** → Click **"Import"**

### Bước 3: Cấu hình Build Settings

```
Framework Preset: Vite
Root Directory: src/views
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Bước 4: Thêm Environment Variable

1. Mở phần **"Environment Variables"**
2. Thêm:

```
Name: VITE_API_URL
Value: https://your-backend-url.railway.app
```

⚠️ Thay URL bằng URL backend thực từ Railway (Bước 6 phần 1)

### Bước 5: Deploy

1. Click **"Deploy"**
2. Đợi 1-2 phút
3. Vercel sẽ cho bạn URL (ví dụ: `https://lightweightbikestore.vercel.app`)

---

## PHẦN 3: CẬP NHẬT CORS CHO BACKEND

Sau khi có URL frontend từ Vercel:

1. Quay lại **Railway** → Vào project backend
2. Vào **Variables**
3. Cập nhật `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS = https://lightweightbikestore.vercel.app
```

4. Railway sẽ tự động redeploy

---

## PHẦN 4: IMPORT DATA VÀO DATABASE

### Cách 1: Dùng Railway CLI

```bash
# Cài Railway CLI
npm install -g @railway/cli

# Login
railway login

# Kết nối project
railway link

# Chạy lệnh trong môi trường Railway
railway run python create_admin.py
```

### Cách 2: Kết nối trực tiếp PostgreSQL

1. Vào Railway → PostgreSQL service
2. Tab **"Connect"** → Copy connection string
3. Dùng pgAdmin hoặc DBeaver để kết nối
4. Import data từ file SQL

---

## 📋 CHECKLIST SAU KHI DEPLOY

- [ ] Backend Railway chạy OK (check `/health` endpoint)
- [ ] Database PostgreSQL đã tạo tables
- [ ] Frontend Vercel load được
- [ ] Đăng nhập/Đăng ký hoạt động
- [ ] CORS không bị lỗi (F12 → Console không có lỗi CORS)

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Module not found"

→ Kiểm tra Root Directory đã đặt đúng `src` chưa

### Lỗi 2: "Database connection failed"

→ Kiểm tra DATABASE_URL có đúng không

### Lỗi 3: "CORS error" trên frontend

→ Cập nhật ALLOWED_ORIGINS trên Railway

### Lỗi 4: Frontend không gọi được API

→ Kiểm tra VITE_API_URL trên Vercel

### Lỗi 5: Build failed trên Vercel

→ Kiểm tra Root Directory là `src/views`

---

## 💰 CHI PHÍ

### Railway (Backend + DB)

- **Free tier**: $5/tháng credit miễn phí
- Đủ cho project nhỏ/demo

### Vercel (Frontend)

- **Free tier**: Unlimited cho personal projects
- 100GB bandwidth/tháng

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, check:

1. Railway Logs: Project → Service → Logs
2. Vercel Logs: Project → Deployments → Functions
3. Browser Console: F12 → Console tab
