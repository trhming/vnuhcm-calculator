# 🎓 Web Tính Điểm ĐHQG-HCM 2026

**Web Tính Điểm ĐHQG-HCM 2026** là một ứng dụng web hiện đại, giúp thí sinh và phụ huynh tính toán, dự kiến điểm xét tuyển vào các trường thành viên thuộc Đại học Quốc gia TP.HCM (VNU-HCM). Dự án được thiết kế để giải quyết bài toán tuyển sinh phức tạp theo phương hướng mới của năm 2026.

## ✨ Tính năng nổi bật

- ⚡ **Tính toán Real-time:** Mọi thay đổi về điểm thành phần, trọng số hay chứng chỉ quốc tế đều được cập nhật kết quả tức thì.
- 🧠 **Công cụ tính điểm thông minh:**
    - **Tự động chọn tổ hợp tối ưu:** Hệ thống tính toán mọi kịch bản (THPT, ĐGNL, Học bạ) và tự động chọn ra phương án có điểm số cao nhất (`Max`) cho thí sinh.
    - **Cơ chế giảm trừ điểm ưu tiên:** Áp dụng chính xác công thức tuyến tính của Bộ GD&ĐT khi tổng điểm đạt ngưỡng (giảm dần khi tiến gần điểm tuyệt đối).
    - **Nội suy điểm học bạ:** Tự động xử lý các trường hợp khuyết điểm học bạ (ví dụ: khuyết Lớp 10) dựa trên quy chế hiện hành.
- 📜 **Quy đổi chứng chỉ quốc tế:** Tích hợp bộ bảng tra quy đổi chuẩn xác cho IELTS, TOEFL, TOEIC, SAT, ACT, A-Level, IB... theo quy định của từng trường thành viên.
- 📱 **Giao diện Responsive:** Thiết kế mượt mà, trực quan trên cả máy tính và thiết bị di động với ngôn ngữ thiết kế Dashboard hiện đại.

## 🚀 Công nghệ sử dụng

- **Frontend:** ReactJS
- **Build Tool:** Vite
- **CSS Framework:** Tailwind CSS
- **Icons:** Lucide React
- **Logic Engine:** Custom React Hooks cho việc quản lý trạng thái và tính toán đa luồng.

## ⚙️ Logic cốt lõi (Core Engine)

Hệ thống được xây dựng để đảm bảo tính minh bạch và chính xác tuyệt đối:

1. **Chuẩn hóa thang điểm:** Chuyển đổi linh hoạt mọi nguồn điểm về thang điểm chuẩn (30 hoặc 100) tùy theo yêu cầu của từng đơn vị đào tạo.
2. **Thuật toán bảo vệ thí sinh:** Tự động so sánh điểm giữa các phương thức xét tuyển kết hợp để tìm ra "con đường" ngắn nhất giúp thí sinh trúng tuyển.
3. **Quản lý điểm ưu tiên:** Tích hợp ma trận điểm ưu tiên khu vực và đối tượng, tự động tính toán mức điểm thực nhận dựa trên tổng điểm học lực và điểm cộng thành tích.

## 📦 Hướng dẫn cài đặt & Chạy Local

Bạn có thể triển khai dự án trên máy cá nhân để phát triển thêm hoặc sử dụng offline:

Bash

`# 1. Clone repository
git clone https://github.com/your-username/vnuhcm-calculator.git

# 2. Di chuyển vào thư mục dự án
cd vnuhcm-calculator

# 3. Cài đặt các thư viện cần thiết
npm install

# 4. Khởi chạy môi trường phát triển
npm run dev`

Sau đó, truy cập địa chỉ `http://localhost:5173` trên trình duyệt của bạn.

## 📄 Giấy phép (License)

Dự án này được phát hành dưới giấy phép **MIT**.

---

*⚠️ **Lưu ý:** Ứng dụng này được xây dựng dựa trên các đề án tuyển sinh dự kiến năm 2026. Kết quả chỉ mang tính chất tham khảo. Thí sinh cần theo dõi và đối chiếu với các thông báo chính thức từ Đại học Quốc gia TP.HCM.*