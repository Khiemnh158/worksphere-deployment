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
- [ ] Khôi phục Docker Desktop đang mất phản hồi. Chạy theo nhóm dịch vụ để giảm tải.
- [ ] Jenkinsfile local: checkout pin, build/test, report, scan, image, compose, smoke.
- [x] Jenkins #2 cố ý fail test, stage deploy bị bỏ qua.
- [ ] P2/P3: Chạy Jenkins đầy đủ và chứng minh gate fail chặn deploy.
- [ ] SonarQube tích hợp Jenkins; webhook + gate fail chặn deploy.
- [x] Metrics registry ở app. Prometheus UP, Grafana có request/lỗi/độ trễ/JVM thật.
- [ ] P4: Target UP và DOWN → UP trên stack triển khai riêng, không tác động app thực hành.
- [x] Backup PostgreSQL/uploads, restore sang project riêng, xác nhận đúng yêu cầu và tệp.
- [ ] Quay lui image trên bản restore và kiểm tra lại khi Docker ổn định.
- [ ] Thu ảnh tự làm, che secrets, gộp một quyển theo mẫu.
- [ ] Viết báo cáo phân công/kết quả/kết luận, nêu chức năng chưa làm.
- [ ] P5: Checkout sạch chạy pipeline, diễn tập demo; báo cáo Word/PDF và slide theo kết quả thật, không tự điền đóng góp/điểm.
- [ ] OPTIONAL: SSH deploy server public + HTTPS/URL sau khi bắt buộc local đạt.

Pin app mới được kiểm tra qua Compose. Lượt Jenkins đầy đủ trên pin còn chờ hoàn tất. Tag MVP tiếp tục ghi nhận mốc app ban đầu.

Phạm vi 02/11/2026: chỉ còn hai môn dự án; An toàn thông tin thi trắc nghiệm. Không phụ thuộc repo chuyên đề bảo mật.
