# WorkSphere Deployment - Triển khai phần mềm

Đóng gói và triển khai [worksphere-app](https://github.com/Khiemnh158/worksphere-app) theo đúng commit, không copy backend vào repo này.

**Hiện trạng 29/10/2026: đã có tài liệu yêu cầu/kế hoạch và version pin. Chưa dựng Jenkins, Docker/Compose, Sonar hay Prometheus/Grafana trong repo này.** Không có cấu hình giả được trình bày như phần mềm đã chạy.

## Bắt buộc theo mẫu người dùng cung cấp
- Jenkins cài/cấu hình trên máy tính cá nhân.
- SonarQube tích hợp Jenkins (thiếu -1 theo mẫu).
- Docker + docker-compose đóng gói/triển khai (không đóng gói được có điều kiện trượt trong mẫu).
- Prometheus + Grafana local (thiếu -1), không bắt buộc đưa monitoring lên public.
- Ảnh tự thực hiện gộp một quyển, không sao chép kết quả nhóm khác.
- SSH deploy lên server public/URL hoạt động là bonus +1 sau khi local đạt.

## Tài liệu
- [Phạm vi và ma trận tiêu chí](docs/COURSE_SCOPE.md)
- [Pipeline/mô hình dự kiến](docs/PIPELINE_PLAN.md)
- [Việc phải làm](TODO.md), [trạng thái](STATUS.md), [quyển ảnh cần thu](evidence/README.md)
- [Version pin](versions.env), [target app](target.json)

App commit khởi đầu `98ac167fcc63952eba0bcf45057117d98034c7a4`; security commit `58ba20c3fcc078195c1621f8eddc86e7571648c0`. Chưa có image digest. Thay pin sau khi app thực sự sửa/test; không dùng main/latest làm bằng chứng nghiệm thu.
