# Việc phải làm - Triển khai phần mềm

Cập nhật 05/11/2026. Kế hoạch chính và điều kiện qua chặng: [P0–P6](docs/PIPELINE_PLAN.md). Chưa triển khai stack.

- [x] Tách phạm vi và điều kiện bắt buộc/bonus của mẫu.
- [x] Ghim app commit và nêu rõ chưa có image.
- [x] Đọc lại mẫu gốc; xác định đúng repo public và chuẩn bị kế hoạch P0–P6.
- [x] Khảo sát công cụ/cổng: Docker CLI có, engine chưa chạy; cần kiểm tra lại tài nguyên khi bắt đầu.
- [x] Ghi kết quả test mới và lỗi fixture QR, giữ JDK 21.
- [ ] P0: Docker engine hoạt động; sửa fixture QR dùng cùng clock; backend đầy đủ/PostgreSQL đạt và kiểm tra web/mobile phù hợp; ghim commit đã kiểm chứng nếu đổi app.
- [ ] P1: Bootstrap opt-in DB triển khai rỗng có kiểm thử, không nới guard DB thực hành.
- [ ] Kiểm tra tài nguyên/công cụ và cài Jenkins trên máy cá nhân.
- [ ] App Dockerfile thật và Compose PostgreSQL/app; health, volume và config riêng.
- [ ] Jenkinsfile local: checkout pin, build/test, report, scan, image, compose, smoke.
- [ ] P2/P3: Chứng minh test fail và gate fail đều chặn deploy; lưu build ID/commit/report cả khi không đạt.
- [ ] SonarQube tích hợp Jenkins; webhook + gate fail chặn deploy.
- [ ] Metrics registry ở app; Prometheus/Grafana local và dashboard dữ liệu thật.
- [ ] P4: Target UP và DOWN → UP trên stack triển khai riêng, không tác động app thực hành.
- [ ] Backup/restore sang DB riêng; rollback image/schema tương thích; runbook đã thử.
- [ ] Thu ảnh tự làm, che secrets, gộp một quyển theo mẫu.
- [ ] Viết báo cáo phân công/kết quả/kết luận, nêu chức năng chưa làm.
- [ ] P5: Checkout sạch chạy pipeline, diễn tập demo; báo cáo Word/PDF và slide theo kết quả thật, không tự điền đóng góp/điểm.
- [ ] OPTIONAL: SSH deploy server public + HTTPS/URL sau khi bắt buộc local đạt.

Chưa có Jenkinsfile/compose.yml/Dockerfile giả trong repo. Thêm file thực thi khi bắt đầu thực hiện và kiểm tra được nó.

Phạm vi 02/11/2026: chỉ còn hai môn dự án; An toàn thông tin thi trắc nghiệm. Không phụ thuộc repo chuyên đề bảo mật.
