# WorkSphere Deployment - Triển khai phần mềm

Đóng gói và triển khai [worksphere-app](https://github.com/Khiemnh158/worksphere-app) theo đúng commit, không copy backend vào repo này.

Docker Compose chạy WorkSphere trên cổng 18210. Jenkins local, SonarQube, Prometheus và Grafana có cấu hình riêng trong repo này. Đọc [hướng dẫn chạy và bàn giao](runbooks/LOCAL.md), [kết quả thực tế](STATUS.md) và [checklist](TODO.md).

Docker/kiểm thử JDK 21 → Compose → Jenkins/Sonar → giám sát → nghiệm thu. [Kế hoạch](docs/PIPELINE_PLAN.md) ghi tiêu chí qua từng chặng. SSH public là bonus sau local.

## Bắt buộc theo mẫu người dùng cung cấp
- Jenkins cài/cấu hình trên máy tính cá nhân.
- SonarQube tích hợp Jenkins (thiếu -1 theo mẫu).
- Docker + docker-compose đóng gói/triển khai (không đóng gói được có điều kiện trượt trong mẫu).
- Prometheus + Grafana local (thiếu -1), không bắt buộc đưa monitoring lên public.
- Ảnh tự thực hiện gộp một quyển, không sao chép kết quả nhóm khác.
- SSH deploy lên server public/URL hoạt động là bonus +1 sau khi local đạt.

## Tài liệu
- [Phạm vi và ma trận tiêu chí](docs/COURSE_SCOPE.md)
- [Kế hoạch P0–P6, pipeline và mô hình local](docs/PIPELINE_PLAN.md)
- [Việc phải làm](TODO.md), [trạng thái](STATUS.md), [minh chứng nghiệm thu](evidence/README.md)
- [Báo cáo tiến độ ngày 11/11/2026](reports/README.md)
- [Version pin](versions.env), [target app](target.json)

Pin triển khai đọc từ `versions.env`. Tag `coursework-mvp-2026-11-02` ghi nhận mốc môn Lập trình nâng cao. Kết quả CI, Compose và giám sát của môn này được ghi riêng trong [STATUS](STATUS.md). [Nghiệm thu app MVP](https://github.com/Khiemnh158/worksphere-app/blob/coursework-mvp-2026-11-02/reports/COURSEWORK_ACCEPTANCE_2026-11-02.md).

Cập nhật phạm vi 02/11/2026: An toàn thông tin thi trắc nghiệm, không có bài tập lớn; pipeline chỉ tham chiếu source app, không phụ thuộc repository chuyên đề bảo mật. Sonar/kiểm tra an toàn theo yêu cầu chất lượng vẫn thuộc pipeline triển khai.
