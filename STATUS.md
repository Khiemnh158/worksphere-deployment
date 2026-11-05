# Hiện trạng

## Chuẩn bị bắt đầu — 05/11/2026

Đã tìm repo public, đọc lại mẫu gốc và chuẩn bị [kế hoạch P0–P6](docs/PIPELINE_PLAN.md) cùng checklist. Lượt này chỉ khảo sát/cập nhật tài liệu, **chưa cài hoặc chạy stack triển khai**.

Docker CLI có nhưng Linux engine chưa chạy khi khảo sát. Giữ JDK 21 và pin `8f342548fbdab566e4e930ae2df6365480fd1c90`. Nếu sửa fixture/container/metrics app, kiểm chứng commit mới rồi mới đổi pin, không di chuyển tag MVP.

Kiểm tra app 05/11: 51 unit, 8 web, 852 mobile đạt; PostgreSQL 58/59. Một fixture QR trộn clock cố định và giờ DB, cần sửa trong P0. Chưa chạy lại đầy đủ 407 backend do engine chưa sẵn sàng. Kết quả 02/11 bên dưới là mốc lịch sử, không phải lượt chạy lại hôm nay.

Chưa có image/digest, Jenkins build, Sonar gate hoặc dashboard mới. Bắt đầu lần sau từ P0 rồi Compose độc lập trước Jenkins.

## Mốc trước đó

Chỉ có tài liệu và ghim phiên bản. Chưa có pipeline Jenkins/quality gate/container stack/monitoring chạy được từ repo này. Việc backend JAR và APK đã chạy local ở lượt trước không chứng minh đã đạt Docker/Jenkins của môn.

Chưa có image digest, số đo RTO/RPO hoặc ảnh minh chứng mới. Sau khi thực hiện phải ghi build ID, commit, digest, ngày giờ và kết quả thật; không copy PASS từ reports legacy.

02/11/2026: ghim app `8f342548fbdab566e4e930ae2df6365480fd1c90` / tag `coursework-mvp-2026-11-02`. Đây là mốc phần mềm đã kiểm chứng JDK21/web/Android local, đủ làm đầu vào môn Triển khai phần mềm. Chưa có bằng chứng Jenkins/Compose/Sonar/monitoring/backup-restore; các phần đó vẫn phải thực hiện trong repo này.
