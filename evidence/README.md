# Quyển minh chứng phải tự thực hiện (chưa có ảnh)

1. Jenkins máy cá nhân, cấu hình node/tools và build ID/SHA.
2. Sonar cùng project/commit, quality gate và Jenkins nhận kết quả; build lỗi có chủ ý chặn deploy.
3. Image tag/digest, Compose healthy và UI chạy trên bản deploy.
4. Prometheus target UP, Grafana có request/latency/error/JVM thật.
5. Restore DB thử riêng, rollback có smoke; nếu làm bonus thì SSH pipeline + URL public.

Mỗi ảnh có chú thích mục tiêu, thao tác, kết quả, ngày, version và người thực hiện. Che password/token/credential/DB dump. Không dùng ảnh audit app để nhận đã làm Jenkins. Gộp ảnh thành một quyển đúng mẫu sau khi có kết quả.
