# Việc phải làm môn Triển khai phần mềm

Cập nhật ngày 10/11/2026. Bản triển khai local đã được nghiệm thu ngày 09/11/2026. Xem [minh chứng](evidence/LOCAL_2026-11-09.md), [báo cáo tiến độ](reports/WorkSphere-Tien-do-2026-11-11.pdf) và [hướng dẫn chạy](runbooks/LOCAL.md).

## Đã hoàn thành

- [x] P0. Ghim app tại `4273f1e`, sửa fixture đồng hồ QR và kiểm thử trên JDK 21. Jenkins #5 đạt 407/407 ca backend và 8/8 ca web.
- [x] P1. Đóng gói API và web, chạy Docker Compose với PostgreSQL và các volume riêng. Kiểm thử luồng gửi, phân công, xử lý và đóng yêu cầu. Yêu cầu và tệp vẫn đọc được sau khi tạo lại API.
- [x] P2. Dựng Jenkins controller và agent Linux. Jenkins #5 chạy thành công từ checkout sạch tại `dd20a3d`. Jenkins #2 bỏ qua deploy khi test thất bại.
- [x] P3. Tích hợp SonarQube và kiểm tra điều kiện triển khai. Jenkins #5 deploy sau gate OK. Jenkins #6 bỏ qua deploy khi project kiểm chứng trả gate ERROR.
- [x] P4. Prometheus ghi nhận UP → DOWN → UP. Grafana đọc số yêu cầu, lỗi HTTP, độ trễ và bộ nhớ JVM.
- [x] P5. Khôi phục PostgreSQL và tệp lên môi trường thử cổng 18211. Kiểm thử nhanh đạt với cả hai image cùng schema khi chuyển phiên bản qua lại.
- [x] Chuẩn bị báo cáo theo mẫu cho buổi trình bày ngày 11/11/2026, gồm kết quả, kịch bản demo, câu hỏi cho giảng viên và phụ lục minh chứng.
- [x] Bổ sung sơ đồ kiến trúc Docker và luồng CI/CD theo góp ý. Bật lại các dịch vụ, chạy lại smoke và chụp sáu ảnh minh chứng ngày 10/11.
- [x] Hoàn thiện bản báo cáo chi tiết với cấu hình từng thành phần, cách đọc kết quả và các bước phục hồi đã kiểm chứng.

## Trước và sau buổi trình bày

- [ ] Điền MSSV, phần việc thực tế và điểm tự đánh giá của từng thành viên trong bản Word nộp lớp.
- [ ] Bật và kiểm tra các dịch vụ trên máy trình bày. Chuẩn bị Jenkins #5, #2 và #6, bản web Docker cổng 18210 và dashboard WorkSphere API.
- [ ] Trình bày tiến độ ngày 11/11/2026. Xác nhận với giảng viên về minh chứng cần bổ sung, cách chạy demo và điều kiện làm phần SSH.
- [ ] Cập nhật báo cáo nộp cuối theo góp ý của giảng viên.

## Phần cộng điểm

- [ ] P6. Khi có máy chủ được phép dùng, cấu hình Jenkins triển khai đúng image qua SSH, kiểm tra URL công khai và lưu minh chứng. Xác nhận yêu cầu HTTPS với giảng viên.
