# Việc phải làm - Triển khai phần mềm

- [x] Tách phạm vi và điều kiện bắt buộc/bonus của mẫu.
- [x] Ghim app/security commit và nêu rõ chưa có image.
- [ ] Kiểm tra tài nguyên/công cụ và cài Jenkins trên máy cá nhân.
- [ ] App Dockerfile thật và Compose PostgreSQL/app; health, volume và config riêng.
- [ ] Jenkinsfile local: checkout pin, build/test, report, scan, image, compose, smoke.
- [ ] SonarQube tích hợp Jenkins; webhook + gate fail chặn deploy.
- [ ] Metrics registry ở app; Prometheus/Grafana local và dashboard dữ liệu thật.
- [ ] Backup/restore sang DB riêng; rollback image/schema tương thích; runbook đã thử.
- [ ] Thu ảnh tự làm, che secrets, gộp một quyển theo mẫu.
- [ ] Viết báo cáo phân công/kết quả/kết luận, nêu chức năng chưa làm.
- [ ] OPTIONAL: SSH deploy server public + HTTPS/URL sau khi bắt buộc local đạt.

Chưa có Jenkinsfile/compose.yml/Dockerfile giả trong repo. Thêm file thực thi khi bắt đầu thực hiện và kiểm tra được nó.
