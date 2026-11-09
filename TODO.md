# Việc phải làm - Triển khai phần mềm

Cập nhật 09/11/2026. [Hướng dẫn chạy](runbooks/LOCAL.md), [kết quả thực tế](STATUS.md) và [tiêu chí P0–P6](docs/PIPELINE_PLAN.md).

- [x] Tách phạm vi và điều kiện bắt buộc/bonus của mẫu.
- [x] Ghim app commit và nêu rõ chưa có image.
- [x] Đọc lại mẫu gốc; xác định đúng repo public và chuẩn bị kế hoạch P0–P6.
- [x] Khảo sát công cụ/cổng: Docker CLI có, engine chưa chạy; cần kiểm tra lại tài nguyên khi bắt đầu.
- [x] Ghi kết quả test mới và lỗi fixture QR, giữ JDK 21.
- [x] P0: Sửa fixture QR, chạy backend 407/407 và web 8/8, ghim ứng viên app.
- [x] P1: Bootstrap opt-in DB triển khai rỗng có kiểm thử, giữ guard DB thực hành.
- [x] Cài Jenkins controller và agent Linux trên máy cá nhân, agent đã kết nối.
- [x] Dockerfile API/web, Compose PostgreSQL/app, health, volume và smoke kể cả sau tái tạo API.
- [x] Khôi phục Docker Desktop và chạy theo từng nhóm dịch vụ.
- [x] Jenkins #5: checkout pin, test, report, scan, image, Compose và smoke.
- [x] Jenkins #2 cố ý fail test, stage deploy bị bỏ qua.
- [x] P2/P3: #5 deploy sau gate OK, #6 nhận gate ERROR và chặn deploy.
- [x] SonarQube tích hợp Jenkins và xác minh quality gate.
- [x] Metrics registry ở app. Prometheus UP, Grafana có request/lỗi/độ trễ/JVM thật.
- [x] P4: Target UP → DOWN → UP và smoke sau phục hồi trên stack riêng.
- [x] Backup PostgreSQL/uploads, restore sang project riêng, xác nhận đúng yêu cầu và tệp.
- [x] Quay lui image trên bản restore rồi trở về image ghim, smoke đạt cả hai.
- [x] Thu ảnh Jenkins, SonarQube, web, Prometheus và Grafana, gộp trong báo cáo.
- [x] Viết báo cáo kết quả và giới hạn, kèm bảng phân công để nhóm xác nhận.
- [x] P5: Checkout sạch chạy pipeline và diễn tập các bước demo bằng smoke.
- [ ] Nhóm điền MSSV, phân công và điểm thực tế trước khi nộp.
- [ ] OPTIONAL: SSH deploy server public + HTTPS/URL sau khi bắt buộc local đạt.

Pin app đã được kiểm chứng qua Jenkins #5 và Compose. Tag MVP ghi nhận mốc app ban đầu.

Phạm vi 02/11/2026: chỉ còn hai môn dự án; An toàn thông tin thi trắc nghiệm. Không phụ thuộc repo chuyên đề bảo mật.
