# Chạy và bàn giao WorkSphere trên máy cá nhân

## Chuẩn bị

Dùng Git, Node.js 24 và Docker Desktop với Linux engine. Kiểm tra `docker version` có phần Server và `docker compose version` trả phiên bản. Kiểm tra RAM Docker trước khi bật Jenkins và SonarQube cùng các dự án khác. Backend dùng Java 21. Các ví dụ dùng PowerShell.

```powershell
git clone --branch docs/deployment-plan-20261105 https://github.com/Khiemnh158/worksphere-deployment.git
Set-Location worksphere-deployment
$pin = (Select-String '^APP_COMMIT=' versions.env).Line.Split('=',2)[1]
git clone --no-checkout https://github.com/Khiemnh158/worksphere-app.git app
git -C app checkout --detach $pin
git -C app rev-parse HEAD
node scripts/init-local.mjs
```

Đối chiếu SHA với `versions.env`. `.env.local` lưu bí mật JWT, mật khẩu PostgreSQL và mật khẩu demo ngẫu nhiên. Giữ file qua các lần chạy vì volume PostgreSQL giữ mật khẩu lúc khởi tạo. Xem mật khẩu demo trong file trên máy, đóng file trước khi chụp minh chứng.

## Docker Compose

```powershell
$app = @('compose','--env-file','versions.env','--env-file','.env.local','-f','compose/compose.yaml')
docker @app config --quiet
docker @app up -d --build --wait --wait-timeout 180
docker @app ps
New-Item -ItemType Directory -Path artifacts -Force | Out-Null
node --env-file=.env.local scripts/smoke.mjs workflow artifacts/smoke.json
```

Mở http://127.0.0.1:18210. Dùng `minh.kd` (người gửi), `hung.it` (trưởng phòng), `hai.it` (xử lý) hoặc `admin.web` (quản trị) với mật khẩu demo. Chỉ nhập dữ liệu giả lập. Profile `deployment-demo` tạo dữ liệu khi được bật chủ động với URL và tên DB Compose riêng. PostgreSQL, uploads và mailbox giữ dữ liệu trong các named volume.

Smoke đi qua Nginx. Script tạo yêu cầu thử có PNG, kiểm tra chặn sai quyền, thực hiện OPEN → phân công → IN_PROGRESS → RESOLVED → CLOSED, kiểm tra từng byte tệp và xác nhận đăng xuất thu hồi truy cập.

## Jenkins và SonarQube

Jenkins ở http://127.0.0.1:18081 và SonarQube ở http://127.0.0.1:19000. Khởi động Sonar trước. Chờ trạng thái `UP` rồi chạy bước cấu hình.

```powershell
node scripts/configure-ci.mjs prepare docs/deployment-plan-20261105
$ci = @('compose','--env-file','.env.local','--env-file','.env.ci','-f','jenkins/compose.yaml')
docker @ci up -d sonarqube
Invoke-RestMethod http://127.0.0.1:19000/api/system/status
# Chạy khi SonarQube trả UP.
node scripts/configure-ci.mjs sonar
docker @ci up -d --build jenkins
# Chạy khi Jenkins tải trang đăng nhập.
node scripts/configure-ci.mjs agent
docker @ci up -d --build agent
docker @ci logs --tail 20 agent
```

Jenkins dùng `coursework` với `JENKINS_LOCAL_PASSWORD`. SonarQube dùng `admin` với `SONAR_ADMIN_PASSWORD`. Các giá trị nằm trong `.env.ci`. Mở job `WorkSphere-Deployment` rồi chọn Build. Lần đầu tải Maven và làm nóng cache.

- Controller có 0 executor. Agent `linux-docker` chạy pipeline và điều khiển Docker local. Job dùng nhánh source tin cậy được chọn khi tạo cấu hình.
- Pipeline kiểm tra SHA app, chạy web/backend với PostgreSQL thử riêng từng build và Testcontainers, lưu JUnit và JaCoCo XML.
- Sonar gửi analysis task ID và webhook tới `http://jenkins:8080/sonarqube-webhook/`. Gate có timeout. Chỉ build/deploy khi gate đạt.
- Hai tham số `FAIL_TEST_DEMO` và `FAIL_GATE_DEMO` thử chặn deploy. Cờ thứ hai phân tích project riêng có ngưỡng coverage 100%. Khi chạy bình thường bỏ chọn cả hai.
- Giữ dịch vụ của cả ba file Compose. Chúng cố ý dùng chung project/network, nên Compose có thể liệt kê các dịch vụ từ file khác trong cảnh báo orphan. Không dùng `--remove-orphans`.

## Prometheus và Grafana

```powershell
$metrics = @('compose','--env-file','.env.ci','-f','monitoring/compose.yaml')
docker @metrics up -d --build
```

Mở targets ở http://127.0.0.1:19090/targets. Target `api:9091` phải UP. Grafana ở http://127.0.0.1:13000 dùng `admin` và `GRAFANA_ADMIN_PASSWORD`. Dashboard WorkSphere API hiển thị trạng thái scrape, request theo status, lỗi HTTP, p95 và bộ nhớ JVM. Chạy smoke để sinh lưu lượng thử.

Khi Jenkins không deploy, dừng riêng API bằng `docker @app stop api`, đợi target DOWN, rồi dùng `docker @app up -d --no-build --wait api` để thấy UP. Chạy `node --env-file=.env.local scripts/smoke.mjs verify artifacts/smoke.json`.

## Sao lưu, khôi phục và quay lui

Sao lưu có một khoảng dừng API để chụp database và tệp cùng thời điểm. Tạo `artifacts/smoke.json` trước khi backup. Dùng thư mục đích và tên project restore mới.

```powershell
node scripts/backup-restore.mjs backup artifacts/backup-demo
node scripts/backup-restore.mjs restore artifacts/backup-demo worksphere-restore-demo 18211
$env:DEPLOY_URL = 'http://127.0.0.1:18211'
node --env-file=.env.local scripts/smoke.mjs verify artifacts/smoke.json
Remove-Item Env:DEPLOY_URL
docker @app -p worksphere-restore-demo stop
```

Bộ sao lưu có dump PostgreSQL, tar.gz uploads và manifest image ID. Script đối chiếu image trước khi phục hồi vào project riêng. Mailbox thử nằm ngoài snapshot. Giữ dump riêng tư.

Quay lui trên bản restore trước. Chọn tag API/web cũ đã lưu và đối chiếu schema Flyway. Đặt `APP_COMMIT` theo tag và `DEPLOY_WEB_PORT=18211`. Chạy `docker @app -p worksphere-restore-demo up -d --no-build --pull never --wait` rồi smoke verify. Bỏ `APP_COMMIT` để trở về pin hiện tại. Nếu schema không tương thích, phục hồi backup đúng phiên bản vào project mới.

## Xử lý sự cố

| Hiện tượng | Kiểm tra |
| --- | --- |
| Docker không có phần Server | Bật Docker Desktop Linux rồi kiểm tra lại. |
| API không healthy | Xem `docker @app logs --tail 80 api` và đối chiếu DB, mật khẩu, volume. |
| Agent offline | Xem log agent, kiểm tra secret, WebSocket và GID Docker socket. |
| Quality gate timeout | Kiểm tra webhook URL, secret, delivery log và task ID. |
| Dashboard trống | Kiểm tra target và khoảng thời gian có request. |

Dừng theo nhóm bằng `docker @app stop`, `docker @ci stop` và `docker @metrics stop`. Giữ lại volume qua các lần chạy. Bàn giao SHA, build ID, image ID, báo cáo và ảnh. Người chạy trên máy khác tự tạo secrets của mình.
