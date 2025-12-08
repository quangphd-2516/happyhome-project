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

## 📋 Các Chức Năng Chi Tiết

### 1️⃣ **Quản lý xác thực & tài khoản người dùng (Authentication & Account)**
- **Đăng ký người dùng mới** — tạo tài khoản với email, password
- **Đăng ký với OTP verification** — gửi mã OTP qua email, xác minh OTP trước khi tạo tài khoản
- **Đăng nhập** — xác thực bằng email/password, nhận access token & refresh token
- **Đăng xuất** — xóa session (tuỳ cấu hình stateless JWT)
- **Quên mật khẩu & Reset password** — gửi link reset qua email
- **Cập nhật hồ sơ người dùng** — thay đổi thông tin cá nhân (tên, avatar, số điện thoại,		 ...)
- **Xem hồ sơ cá nhân** — lấy thông tin người dùng hiện tại
- **Quản lý quyền truy cập** — phân quyền user/admin, middleware auth validation

### 2️⃣ **Quản lý bất động sản (Property Management)**
- **Tạo tài sản mới** — add mô tả, giá, địa chỉ, hình ảnh (lưu qua Cloudinary)
- **Xem danh sách bất động sản** — lọc theo giá, vị trí, loại hình, phân trang
- **Xem chi tiết bất động sản** — hình ảnh, mô tả, vị trí trên map, đánh giá
- **Cập nhật thông tin bất động sản** — chỉnh sửa mô tả, giá, hình ảnh
- **Xóa bất động sản** — loại bỏ khỏi danh sách
- **Danh sách bất động sản của tôi** — xem tất cả tài sản mà user đã đăng
- **Tìm kiếm & lọc nâng cao** — theo vị trí, giá, trạng thái, ngày đăng

### 3️⃣ **Hệ thống đấu giá (Auction System)**
- **Tạo phiên đấu giá** — chọn bất động sản, đặt giá khởi điểm, thời gian bắt đầu/kết thúc
- **Xem danh sách đấu giá** — tất cả phiên, lọc theo trạng thái (sắp tới, đang diễn ra, đã kết thúc)
- **Xem chi tiết phiên đấu giá** — giá hiện tại, người đấu giá cao nhất, lịch sử bid
- **Đặt giá (Bid)** — tăng giá cho phiên đấu giá đang diễn ra, cập nhật real-time via WebSocket
- **Xem lịch sử đấu giá của tôi** — các phiên tôi đã tham gia/tạo
- **Nhận thông báo** — khi ai đó out-bid, khi phiên kết thúc, khi tôi trúng giá
- **Tính năng tự động lên giá** — thiết lập giá bid tự động cho phiên

### 4️⃣ **Quản lý thanh toán (Payment Gateway Integration)**
- **Thanh toán qua VNPay** — tạo order, redirect đến VNPay, xử lý callback (IPN)
- **Thanh toán qua MoMo** — tạo QR code, xác nhận thanh toán qua webhook
- **Theo dõi giao dịch** — xem trạng thái thanh toán, thời gian, số tiền
- **Lịch sử thanh toán** — danh sách tất cả giao dịch của người dùng
- **Hoàn tiền** — xử lý refund nếu hủy phiên đấu giá
- **Hóa đơn/Receipt** — tạo hóa đơn thanh toán (tuỳ cấu hình)

### 5️⃣ **Xác minh danh tính KYC (Know Your Customer)**
- **Gửi thông tin KYC** — điền form thông tin cá nhân (tên, DOB, địa chỉ)
- **Upload tài liệu** — hình ảnh CMND/passport mặt trước/mặt sau, ảnh selfie (lưu qua Cloudinary)
- **Kiểm tra trạng thái KYC** — pending, approved, rejected
- **Xem lịch sử KYC** — các lần gửi trước, lý do từ chối (nếu có)
- **Admin review KYC** — phê duyệt/từ chối, thêm ghi chú
- **Xác thực lại KYC** — gửi lại tài liệu khi bị reject

### 6️⃣ **Trò chuyện theo thời gian thực (Real-time Chat)**
- **Tạo hoặc mở phòng chat** — bắt đầu cuộc trò chuyện với người khác
- **Gửi tin nhắn** — text, hình ảnh (tuỳ cấu hình)
- **Nhận tin nhắn real-time** — via WebSocket (Socket.io), cập nhật tức thì
- **Xem danh sách chat** — tất cả cuộc trò chuyện của người dùng, sắp xếp theo tin mới nhất
- **Lịch sử tin nhắn** — phân trang, tìm kiếm
- **Thông báo tin nhắn mới** — khi có tin nhắn từ người khác
- **Trạng thái online/offline** — hiển thị trạng thái ng dùng

### 7️⃣ **Bảng Điều Khiển Admin (Admin Dashboard)**
- **Thống kê tổng quan** — tổng user, tổng phiên đấu giá, doanh thu, ...
- **Quản lý người dùng** — xem danh sách, deactive/ban, lọc theo role
- **Quản lý phiên đấu giá** — xem, chỉnh sửa, hủy phiên
- **Quản lý KYC** — review, phê duyệt, từ chối, tìm kiếm theo trạng thái
- **Quản lý thanh toán** — xem tất cả giao dịch, kiểm tra trạng thái
- **Biểu đồ doanh thu** — theo ngày/tháng/năm
- **Biểu đồ tăng trưởng người dùng** — theo kỳ thời gian
- **Hoạt động gần đây** — log các hành động quan trọng của hệ thống
- **Quản lý bất động sản** — xem, xóa, ẩn tài sản vi phạm

### 8️⃣ **Tính năng bổ sung khác**
- **Upload ảnh qua Cloudinary** — lưu trữ đám mây, CDN nhanh
- **Đánh giá & bình luận** — rating bất động sản, phiên đấu giá
- **Thông báo Push** — khi có sự kiện quan trọng (bid, message, KYC, ...)
- **Tìm kiếm nâng cao** — fulltext search, lọc nhiều tiêu chí
- **Rate Limiter** — ngăn chặn spam, brute force
- **Email Service** — gửi xác nhận OTP, reset password, thông báo
- **Logger & Monitoring** — log tất cả request, error, hoạt động
- **Swagger API Docs** — tài liệu API chi tiết, test trực tiếp

---

## 🔌 API Endpoints Overview

| Module | Method | Endpoint | Mô tả |
|--------|--------|----------|-------|
| **Auth** | POST | `/api/v1/auth/register` | Đăng ký người dùng |
| | POST | `/api/v1/auth/register-otp` | Đăng ký + OTP verification |
| | POST | `/api/v1/auth/login` | Đăng nhập |
| | POST | `/api/v1/auth/logout` | Đăng xuất |
| **Users** | GET | `/api/v1/users/profile` | Lấy hồ sơ cá nhân |
| | PUT | `/api/v1/users/profile` | Cập nhật hồ sơ |
| | GET | `/api/v1/users/:id` | Lấy thông tin user theo ID |
| **Properties** | GET | `/api/v1/properties` | Danh sách bất động sản |
| | POST | `/api/v1/properties` | Tạo bất động sản mới |
| | GET | `/api/v1/properties/my-properties` | Bất động sản của tôi |
| | GET | `/api/v1/properties/:id` | Chi tiết bất động sản |
| | PUT | `/api/v1/properties/:id` | Cập nhật bất động sản |
| | DELETE | `/api/v1/properties/:id` | Xóa bất động sản |
| **Auctions** | GET | `/api/v1/auctions` | Danh sách phiên đấu giá |
| | POST | `/api/v1/auctions` | Tạo phiên đấu giá (admin) |
| | GET | `/api/v1/auctions/:id` | Chi tiết phiên đấu giá |
| | POST | `/api/v1/auctions/:id/bid` | Đặt giá |
| | GET | `/api/v1/auctions/upcoming` | Phiên sắp tới |
| | GET | `/api/v1/auctions/ongoing` | Phiên đang diễn ra |
| | GET | `/api/v1/auctions/completed` | Phiên đã kết thúc |
| **Payments** | POST | `/api/v1/payments/vnpay` | Tạo thanh toán VNPay |
| | POST | `/api/v1/payments/momo` | Tạo thanh toán MoMo |
| | GET | `/api/v1/payments/vnpay-return` | VNPay callback |
| | GET | `/api/v1/payments/momo-return` | MoMo callback |
| **KYC** | POST | `/api/v1/kyc/submit` | Gửi thông tin KYC |
| | GET | `/api/v1/kyc/status` | Kiểm tra trạng thái KYC |
| | POST | `/api/v1/kyc/upload` | Upload tài liệu KYC |
| **Chat** | GET | `/api/v1/chats` | Danh sách chat |
| | POST | `/api/v1/chats` | Tạo chat mới |
| | GET | `/api/v1/chats/:id` | Chi tiết chat + tin nhắn |
| | POST | `/api/v1/chats/:id/messages` | Gửi tin nhắn |
| **Admin** | GET | `/api/v1/admin/stats` | Thống kê tổng quan |
| | GET | `/api/v1/admin/kyc-list` | Danh sách KYC chờ duyệt |
| | POST | `/api/v1/admin/kyc/:id/approve` | Phê duyệt KYC |
| | GET | `/api/v1/admin/users` | Quản lý người dùng |
| | GET | `/api/v1/admin/auctions` | Quản lý phiên đấu giá |

---

Nếu bạn muốn, tôi có thể:
- Thêm ví dụ cấu hình `.env` chi tiết từ `.env.example`.
- Thêm hướng dẫn deploy Docker / PM2 cụ thể.
- Viết hướng dẫn cho CI (GitHub Actions) hoặc scripts deploy.
- Mô tả chi tiết flow cho từng tính năng (Authentication flow, Auction flow, Payment flow).

