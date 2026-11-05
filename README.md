# WorkSphere Deployment - Triển khai phần mềm

Đóng gói và triển khai [worksphere-app](https://github.com/Khiemnh158/worksphere-app) theo đúng commit, không copy backend vào repo này.

**Hiện trạng 05/11/2026: đã chuẩn bị kế hoạch P0–P6, checklist và ghim MVP app. Chưa dựng Jenkins, Docker/Compose, Sonar hay Prometheus/Grafana trong repo này.** Không có cấu hình giả được trình bày như phần mềm đã chạy.

Khi bắt đầu: Docker/fixture QR/kiểm thử JDK 21 → Compose độc lập → Jenkins/Sonar → monitoring → nghiệm thu/báo cáo. [Kế hoạch chính](docs/PIPELINE_PLAN.md) ghi điều kiện hoàn thành; [TODO](TODO.md) theo dõi tiến độ thật. SSH public là bonus sau local.

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
- [Việc phải làm](TODO.md), [trạng thái](STATUS.md), [quyển ảnh cần thu](evidence/README.md)
- [Version pin](versions.env), [target app](target.json)

App commit được ghim `8f342548fbdab566e4e930ae2df6365480fd1c90`, tag `coursework-mvp-2026-11-02`. [Bằng chứng app](https://github.com/Khiemnh158/worksphere-app/blob/coursework-mvp-2026-11-02/reports/COURSEWORK_ACCEPTANCE_2026-11-02.md): JDK21, 407 backend tests, 852 mobile tests, 8 web tests; OPPO và clone sạch cùng máy đã nghiệm thu trong phạm vi mô tả. Chưa có image digest hoặc pipeline; không dùng main/latest hay kết quả local để nhận đã đạt môn triển khai.

Cập nhật phạm vi 02/11/2026: An toàn thông tin thi trắc nghiệm, không có bài tập lớn; pipeline chỉ tham chiếu source app, không phụ thuộc repository chuyên đề bảo mật. Sonar/kiểm tra an toàn theo yêu cầu chất lượng vẫn thuộc pipeline triển khai.
