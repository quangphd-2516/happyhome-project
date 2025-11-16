# HappyHome Project

**Mô tả ngắn:**
- **HappyHome** là một nền tảng đấu giá và quản lý bất động sản (auction & property management) gồm backend API (Node.js/Express + Prisma) và frontend SPA (React + Vite + Tailwind). Dự án cung cấp chức năng đăng ký/đăng nhập (OTP), đấu giá thời gian thực (WebSocket), quản lý KYC, thanh toán (MoMo, VNPay), upload ảnh (Cloudinary), và bảng quản trị.

**Tác giả:** Nguyễn Trọng Quang

**Liên hệ:** (thêm email hoặc thông tin liên hệ nếu muốn)

**Mục lục**
- **Mô tả**
- **Yêu cầu hệ thống**
- **Cài đặt & Chạy**
	- Backend
	- Frontend
- **Biến môi trường**
- **Cơ sở dữ liệu & Prisma**
- **Kiểm thử**
- **Kiến trúc & Công nghệ**
- **Đóng góp**
- **Giấy phép**

**Mô tả chi tiết**
- Ứng dụng gồm 2 phần chính:
	- Backend: REST API xây dựng bằng Node.js (Express), sử dụng Prisma làm ORM cho database, có các service xử lý auth, auction, payment, kyc, websocket, ...
	- Frontend: Single Page App bằng React + Vite + Tailwind, cung cấp giao diện cho người dùng và admin.

**Yêu cầu hệ thống**
- Node.js >= 18 (Node >=12 được hỗ trợ nhưng nên dùng LTS mới hơn)
- npm hoặc yarn
- Một DB tương thích với Prisma (Postgres / MySQL / SQLite tùy cấu hình `.env`)

**Cài đặt & Chạy (nhanh)**

1) Clone repo

```powershell
git clone <repo-url>
cd happyhome-project
```

2) Backend

- Vào thư mục backend, cài dependencies, cấu hình `.env`, chạy migration & seed (nếu cần), rồi chạy server.

```powershell
cd backend
npm install
# tạo file .env từ .env.example và chỉnh sửa theo môi trường
copy .env.example .env

# (1) chạy migration bằng Prisma (nếu dùng Postgres/MySQL)
npx prisma migrate deploy

# (2) (tuỳ cấu hình) seed dữ liệu
npm run prisma --silent || npx prisma db seed

# (3) chạy server trong dev
npm run dev

# hoặc chạy production (pm2 cần được cài global nếu sử dụng)
npm run start
```

Ghi chú: repository đã dùng `prisma` (file `prisma/schema.prisma`) và `@prisma/client`. Kiểm tra `backend/package.json` scripts: `dev`, `start`, `test`, `lint`, `prepare`.

3) Frontend

```powershell
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173` (mặc định Vite) hoặc địa chỉ console hiển thị.

**Biến môi trường (tổng quan)**
- Backend có file `.env.example` (sao chép thành `.env`) chứa các biến quan trọng như:
	- `DATABASE_URL` — kết nối DB cho Prisma
	- `PORT` — cổng server
	- `JWT_SECRET`, `JWT_ACCESS_EXPIRATION_MINUTES`, `JWT_REFRESH_EXPIRATION_DAYS` — cấu hình auth
	- `CLOUDINARY_URL` / `CLOUDINARY_*` — cấu hình upload ảnh
	- Các thông tin thanh toán: MoMo, VNPAY, Momo/MoMo config files

- Frontend có thể có `VITE_` prefixed env vars trong file `.env` (tuỳ cấu hình). Kiểm tra `frontend/.env` nếu cần chỉ rõ endpoint API.

**Cơ sở dữ liệu & Prisma**
- Schema: `backend/prisma/schema.prisma`.
- Migrations có sẵn trong `backend/prisma/migrations/`.
- Các lệnh hữu ích:
	- `npx prisma migrate dev` — chạy migration trong môi trường dev
	- `npx prisma migrate deploy` — áp dụng migration (production)
	- `npx prisma db push` — đồng bộ schema (không tạo migration)
	- `npx prisma db seed` hoặc `node prisma/seed.js` — seed dữ liệu (script được cấu hình trong `package.json` `prisma.seed`)

**Kiểm thử**
- Backend sử dụng `jest` và có test trong `src/tests`. Một số script có sẵn trong `backend/package.json`:
	- `npm test` — chạy test
	- `npm run test:watch` — watch mode

**Lint & Format**
- Backend: `npm run lint`, `npm run lint:fix`, `npm run prettier`, `npm run prettier:fix`.
- Frontend: `npm run lint`.

**Kiến trúc & Thư mục chính**
- `backend/src/`
	- `controllers/` — route handlers
	- `services/` — logic nghiệp vụ
	- `models/` — Prisma models / token/user helpers
	- `routes/` — định nghĩa route (dưới `routes/v1/`)
	- `middlewares/` — auth, validate, error handler, rateLimiter
	- `config/` — cấu hình (cloudinary, tokens, logger, payment configs)
	- `prisma/` — schema, migrations, seed

- `frontend/src/` — components, pages, services (API calls), store

**Tính năng nổi bật**
- Đăng ký/Đăng nhập với OTP
- Phiên đấu giá thời gian thực (socket.io)
- Thanh toán tích hợp MoMo & VNPay
- Quản lý KYC (upload tài liệu, review)
- Upload hình ảnh qua Cloudinary
- Hệ thống phân quyền (roles) và dashboard admin

**Chú ý vận hành**
- Đảm bảo đặt chính xác `DATABASE_URL` và các biến thanh toán / cloud trước khi chạy.
- Trong production, khuyến nghị dùng process manager (`pm2`) hoặc Docker (repository có script `docker:prod`/`docker:dev`).

**Đóng góp**
- Các PR chào đón: mở issue mô tả vấn đề / feature, fork repo, tạo branch, gửi PR.

**Giấy phép**
- Được cấp phép theo MIT (tuỳ file license trong repo).

---

Nếu bạn muốn, tôi có thể:
- Thêm ví dụ cấu hình `.env` chi tiết từ `.env.example`.
- Thêm hướng dẫn deploy Docker / PM2 cụ thể.
- Viết hướng dẫn cho CI (GitHub Actions) hoặc scripts deploy.

Tôi đã chuẩn bị README cơ bản này cho bạn. Muốn tôi cập nhật thêm nội dung cụ thể (ví dụ: thông tin kết nối DB mẫu, các endpoint API chính, hay tài liệu kiến trúc) không?

