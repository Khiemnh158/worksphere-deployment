# Pipeline đề xuất (CHƯA TRIỂN KHAI)

```mermaid
flowchart TD
  A[Checkout app + security commit đã ghim] --> B[Build / unit / integration tests]
  B --> C[Sonar analysis + security scan]
  C --> D{Quality gate đạt?}
  D -- Không --> E[Dừng, không deploy]
  D -- Có --> F[Build Docker image tag SHA và digest]
  F --> G[Compose local: DB + API + web nếu có]
  G --> H[Health + smoke nghiệp vụ]
  H --> I[Prometheus UP / Grafana có dữ liệu]
  I --> J[Lưu test, manifest, ảnh đã che secret]
  J --> K[SSH public bonus nếu đã đạt local]
```

## Ownership
- Dockerfiles build ứng dụng sẽ ở repo app cạnh backend/web sau khi thực hiện.
- Repo này giữ Compose, Jenkinsfiles, monitoring configs và scripts/runbook.
- Jenkins checkout app tại APP_COMMIT vào workspace/app, dùng Dockerfile/context đúng version. Security scan runner cũng phải ghim SECURITY_COMMIT.
- Không có web chạy thật ở baseline; pipeline không được giả định đã có thư mục web/build output.

## Mô hình chạy dự kiến
Web/mobile → reverse proxy/API → PostgreSQL + file volume. Prometheus scrape API trong network nội bộ; Grafana đọc Prometheus. Jenkins và Sonar trên máy cá nhân/node phù hợp, metrics/admin UI không tự mở public.

## Việc cần kiểm chứng
JDK 21/Node theo app; Testcontainers dùng PostgreSQL thật; Sonar webhook/timeout; secret chỉ trong Jenkins credential; image không chứa secrets/compiler; volume không xóa để chữa lỗi; restore sang DB thử riêng; rollback image tương thích schema. Các mục này chưa chạy.

Nguồn app: https://github.com/Khiemnh158/worksphere-app; framework pipeline cần theo phiên bản tool thực tế được cài. Jenkins bắt buộc trong mẫu, GitHub Actions chỉ là bổ sung nếu làm sau.
