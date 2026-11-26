# health/smoke/backup/restore/rollback

- `init-local.mjs` tạo secrets local một lần.
- `configure-ci.mjs` chuẩn bị secrets CI, dự án Sonar, webhook và agent.
- `ci-test-backend.sh` tạo PostgreSQL thử riêng, chạy Maven và JaCoCo.
- `smoke.mjs` chạy luồng hỗ trợ và kiểm tra tệp sau restart hoặc restore.
- `verify-openapi.mjs` kiểm tra Swagger UI/config/schema, hợp đồng JWT và API công việc chưa đăng nhập; không cần mật khẩu, không tạo dữ liệu nghiệp vụ.
- `verify-openapi.test.mjs` kiểm tra script trên với phản hồi giả lập; chạy bằng `node --test scripts/verify-openapi.test.mjs`.
- `backup-restore.mjs` sao lưu DB và uploads, phục hồi vào project mới.

Thứ tự và tham số trong [runbook](../runbooks/LOCAL.md).
