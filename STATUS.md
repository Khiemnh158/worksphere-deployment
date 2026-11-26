# Hiện trạng

## Bàn giao source ngày 26/11/2026

- `versions.env` và `target.json` cùng ghim app `fb45038`, có bản sửa Swagger,
  kiểm tra đăng nhập, Gradle Sync Windows và tuyến tài liệu qua Nginx.
- Jenkins được bổ sung ba test cho script kiểm tra OpenAPI và bước xác nhận UI,
  config/schema trả 200, JWT đúng hợp đồng, API nghiệp vụ chưa đăng nhập trả 401.
- Script kiểm tra đạt 3 test; HTTP đạt 4 kiểm tra với API local và 4 kiểm tra qua
  Nginx Windows thử riêng. Không thay cấu hình hoặc dữ liệu đang dùng để demo.
- Docker engine đang tắt: chưa build image hoặc chạy quality gate cho pin mới.
  Metadata image của Jenkins #10 được giữ dưới `last_verified_release`, không
  dùng làm image ID của pin hiện tại.

[Chi tiết bản cập nhật](evidence/UPDATE_2026-11-26.md).

## Bản vá và nghiệm thu ngày 25/11/2026

- Báo cáo Word/PDF đã cập nhật kết quả #10, app `2ae3b83`, bước đối chiếu image và 10 ảnh chụp ngày 25/11. Giữ nguyên giảng viên, năm thành viên và các ô trống; mục lục và viền bìa đã kiểm tra qua bản render.

- Jenkins #10 SUCCESS tại app commit `2ae3b83`, deployment commit `9f28cb8`.
- 411 test backend và 8 test web đạt. Không có test lỗi hoặc bỏ qua.
- SonarQube gate OK, coverage phần code mới 86,1%, issue mới 0. Gate giữ các ngưỡng đang có.
- API và web chạy đúng image ID được lưu trong artifact runtime-images.json. Web chạy bằng user nginx.
- Luồng hỗ trợ kèm tệp, chặn sai quyền và thu hồi phiên đạt. Kiểm lại tệp từ build #7 sau triển khai vẫn đạt.
- Prometheus và Grafana đọc được API UP cùng số liệu request, lỗi HTTP và JVM sau triển khai.
- Sáu plugin Jenkins được ghim bản vá và đang active. Đối chiếu update center đã lưu không còn advisory plugin khớp phiên bản đang cài.
- Build #8 bị chặn do coverage phần mới 75%. Build #9 bị chặn do ba cảnh báo trong file test. Build #10 đã đạt cả hai điều kiện.
- Sonar vẫn còn 9 cảnh báo security và 44 reliability trên toàn bộ mã. Log test còn cảnh báo đóng fork Surefire dù 411 test đạt. Các mục này tiếp tục được ghi nhận.

[Minh chứng và phiên bản](evidence/LOCAL_2026-11-25.md).

## Chuẩn bị trình bày ngày 11/11/2026

- [Báo cáo tiến độ](reports/README.md) tổng hợp kết quả nghiệm thu ngày 09/11, kịch bản demo và câu hỏi cho giảng viên. Đây là cập nhật tài liệu dựa trên các lượt chạy đã lưu.
- Ngày 10/11, bổ sung hai sơ đồ tại mục 2 và thay sáu ảnh minh chứng sau khi bật lại WorkSphere, Jenkins, SonarQube, Prometheus và Grafana. Smoke mới đạt, yêu cầu đã đóng và tệp đính kèm khớp. Ảnh Jenkins #5 và #6 mở lại kết quả ngày 09/11.
- [TODO](TODO.md) ghi các việc còn lại trước khi trình bày và nộp bản cuối. SSH lên máy chủ công khai vẫn chờ điều kiện thực hiện phần cộng điểm.

## Kết quả nghiệm thu local ngày 09/11/2026

- Docker Desktop đã khởi động lại. Chạy Jenkins và SonarQube theo từng chặng để kiểm soát bộ nhớ.
- Jenkins #5 từ checkout sạch tại `dd20a3d`: backend 407/407, web 8/8, Sonar gate OK, Docker Compose healthy, smoke nghiệp vụ và tệp đạt.
- Jenkins #2 chặn deploy khi test lỗi. Jenkins #6 có 407 test đạt nhưng project kiểm chứng trả gate ERROR, stage deploy bị bỏ qua. Gate của project triển khai giữ chính sách bình thường.
- Prometheus thấy UP → DOWN → UP. Grafana đọc request, lỗi HTTP, độ trễ và JVM. Yêu cầu và tệp còn nguyên sau restart.
- Backup/restore và thử chuyển qua lại hai image trên DB khôi phục cổng 18211 đều đạt smoke. Hai image dùng cùng schema.
- [Minh chứng và SHA](evidence/LOCAL_2026-11-09.md). SSH public là phần cộng điểm chờ máy chủ.

## Các lượt chạy trước khi hoàn tất nghiệm thu ngày 09/11/2026

- P0: JDK 21 build đạt, 407 backend tests đạt, 0 fail/error/skip. Nhóm PostgreSQL chạy trên DB thử riêng, bao gồm ca QR đã sửa đồng hồ. Web 8/8 đạt.
- P1: image preview API/web và Compose chạy với PostgreSQL riêng. Smoke qua Nginx đã xác nhận login/logout, chặn sai quyền, gửi yêu cầu kèm tệp, phân công, xử lý, đóng và tải lại tệp sau khi tái tạo API.
- P2/P3: Jenkins local, agent Linux và SonarQube đã lên. Cấu hình hai project Sonar và webhook đã tạo. Cần nghiệm thu Jenkinsfile từ Git với commit mới trước khi ghi pipeline đạt.
- P4: Prometheus đã scrape được API qua management port nội bộ, Grafana đã chạy. Cần kiểm tra panel có dữ liệu và minh chứng DOWN → UP.
- Pin ứng viên triển khai là `4273f1ed907eb49ae0023ab1cacff7c25de8a691`. Ứng viên gồm bản sửa test QR, image và profile Docker riêng, metrics. Kết quả 407 ở P0 có bản sửa test QR, lần chạy Jenkins sẽ kiểm tra lại đầy đủ pin mới. Tag MVP là mốc lịch sử.

Jenkins #2 cố ý làm test thất bại và đã bỏ qua deploy. #3 đã checkout đúng SHA, chạy web 8/8 và kết nối Testcontainers qua Docker Linux. Máy thiếu bộ nhớ khi đồng thời chạy Jenkins, hai stack app và các dịch vụ giám sát. Cần khôi phục Docker Desktop và chạy từng chặng để có kết quả Jenkins đầy đủ.

Backup PostgreSQL và uploads đã phục hồi trong project riêng trên cổng 18211. Smoke tải lại đúng yêu cầu CLOSED và từng byte của tệp. Đã thu target UP, DOWN và các số liệu thật qua datasource Grafana. Ca khởi động lại và quay lui cần hoàn tất khi Docker ổn định.

## Chuẩn bị bắt đầu — 05/11/2026

Đã tìm repo public, đọc lại mẫu gốc và chuẩn bị [kế hoạch P0–P6](docs/PIPELINE_PLAN.md) cùng checklist. Lượt này chỉ khảo sát/cập nhật tài liệu, **chưa cài hoặc chạy stack triển khai**.

Docker CLI có nhưng Linux engine chưa chạy khi khảo sát. Giữ JDK 21 và pin `8f342548fbdab566e4e930ae2df6365480fd1c90`. Nếu sửa fixture/container/metrics app, kiểm chứng commit mới rồi mới đổi pin, không di chuyển tag MVP.

Kiểm tra app 05/11: 51 unit, 8 web, 852 mobile đạt; PostgreSQL 58/59. Một fixture QR trộn clock cố định và giờ DB, cần sửa trong P0. Chưa chạy lại đầy đủ 407 backend do engine chưa sẵn sàng. Kết quả 02/11 bên dưới là mốc lịch sử, không phải lượt chạy lại hôm nay.

Chưa có image/digest, Jenkins build, Sonar gate hoặc dashboard mới. Bắt đầu lần sau từ P0 rồi Compose độc lập trước Jenkins.

## Mốc trước đó

Chỉ có tài liệu và ghim phiên bản. Chưa có pipeline Jenkins/quality gate/container stack/monitoring chạy được từ repo này. Việc backend JAR và APK đã chạy local ở lượt trước không chứng minh đã đạt Docker/Jenkins của môn.

Chưa có image digest, số đo RTO/RPO hoặc ảnh minh chứng mới. Sau khi thực hiện phải ghi build ID, commit, digest, ngày giờ và kết quả thật; không copy PASS từ reports legacy.

02/11/2026: ghim app `8f342548fbdab566e4e930ae2df6365480fd1c90` / tag `coursework-mvp-2026-11-02`. Đây là mốc phần mềm đã kiểm chứng JDK21/web/Android local, đủ làm đầu vào môn Triển khai phần mềm. Chưa có bằng chứng Jenkins/Compose/Sonar/monitoring/backup-restore; các phần đó vẫn phải thực hiện trong repo này.
