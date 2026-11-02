# Hiện trạng

Chỉ có tài liệu và ghim phiên bản. Chưa có pipeline Jenkins/quality gate/container stack/monitoring chạy được từ repo này. Việc backend JAR và APK đã chạy local ở lượt trước không chứng minh đã đạt Docker/Jenkins của môn.

Chưa có image digest, số đo RTO/RPO hoặc ảnh minh chứng mới. Sau khi thực hiện phải ghi build ID, commit, digest, ngày giờ và kết quả thật; không copy PASS từ reports legacy.

02/11/2026: ghim app `8f342548fbdab566e4e930ae2df6365480fd1c90` / tag `coursework-mvp-2026-11-02`. Đây là mốc phần mềm đã kiểm chứng JDK21/web/Android local, đủ làm đầu vào môn Triển khai phần mềm. Chưa có bằng chứng Jenkins/Compose/Sonar/monitoring/backup-restore; các phần đó vẫn phải thực hiện trong repo này.
