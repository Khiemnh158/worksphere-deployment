# Chạy và bàn giao WorkSphere trên máy cá nhân

## Chuẩn bị

Dùng Git, Node.js 24 và Docker Desktop với Linux engine. Kiểm tra `docker version` có phần Server, `docker compose version` trả phiên bản và `node --version` là v24. JDK 21 được cung cấp trong image backend và agent Jenkins. Lần đầu cần Internet để lấy mã nguồn, image và thư viện Maven. Các ví dụ dùng PowerShell.

Mở Docker Desktop trước rồi chạy khối lệnh sau một lần từ thư mục cha nơi muốn lưu dự án.

```powershell
git clone --branch docs/deployment-plan-20261105 https://github.com/Khiemnh158/worksphere-deployment.git
Set-Location worksphere-deployment
$branch = git branch --show-current
$pin = (Select-String '^APP_COMMIT=' versions.env).Line.Split('=',2)[1]
$source = (Select-String '^APP_REPOSITORY=' versions.env).Line.Split('=',2)[1]
git clone --no-checkout $source app
git -C app checkout --detach $pin
git -C app rev-parse HEAD
node scripts/init-local.mjs
node scripts/configure-ci.mjs prepare $branch
```

Đối chiếu SHA với `versions.env`. `.env.local` giữ mật khẩu demo, mật khẩu PostgreSQL và bí mật JWT. `.env.ci` giữ thông tin đăng nhập Jenkins, SonarQube và Grafana của máy này. Các script sinh thông tin riêng cho từng bản cài. Giữ hai file qua các lần chạy để khớp với dữ liệu đang có trong volume. Mở file bằng trình soạn thảo khi cần lấy mật khẩu để đăng nhập.

| Trang local | URL | Tài khoản và nơi lấy mật khẩu |
| --- | --- | --- |
| WorkSphere Docker | http://127.0.0.1:18210/ | `minh.kd`, `hung.it`, `hai.it` hoặc `admin.web`. Dùng `DEPLOY_DEMO_PASSWORD` trong `.env.local`. |
| Jenkins | http://127.0.0.1:18081/job/WorkSphere-Deployment/ | `coursework`, dùng `JENKINS_LOCAL_PASSWORD` trong `.env.ci`. |
| SonarQube | http://127.0.0.1:19000/ | `admin`, dùng `SONAR_ADMIN_PASSWORD` sau bước cấu hình SonarQube. |
| Prometheus | http://127.0.0.1:19090/targets | Mở trực tiếp trên máy. |
| Grafana | http://127.0.0.1:13000/ | `admin`, dùng `GRAFANA_ADMIN_PASSWORD` trong `.env.ci`. |

Thư mục `app/` chứa checkout ứng dụng theo commit đã ghim. Thư mục `artifacts/` lưu kết quả kiểm thử và sao lưu của từng máy. Git bỏ qua hai thư mục này và các file môi trường local.

## Docker Compose

Giữ cửa sổ PowerShell tại gốc kho triển khai. Chạy khối này trước để web, API và PostgreSQL sẵn sàng, đồng thời tạo kết quả smoke cho các bước giám sát và khôi phục.

```powershell
$app = @('compose','--env-file','versions.env','--env-file','.env.local','-f','compose/compose.yaml')
docker @app config --quiet
docker @app up -d --build --wait --wait-timeout 180
docker @app ps
New-Item -ItemType Directory -Path artifacts -Force | Out-Null
node --env-file=.env.local scripts/smoke.mjs workflow artifacts/smoke.json
```

Mở WorkSphere cổng 18210. Dùng `minh.kd` làm người gửi, `hung.it` phân công và `hai.it` xử lý trước khi quay lại Minh để xác nhận. `admin.web` dùng cho phần quản trị. Profile `deployment-demo` tạo dữ liệu mẫu trong database Compose dành riêng. PostgreSQL, uploads và mailbox giữ dữ liệu trong các volume.

Smoke đi qua Nginx. Script tạo yêu cầu thử có PNG, kiểm tra chặn sai quyền, thực hiện OPEN → phân công → IN_PROGRESS → RESOLVED → CLOSED, kiểm tra từng byte tệp và xác nhận đăng xuất thu hồi truy cập. Kết quả đạt in `WorkSphere smoke workflow: PASS` và ghi `artifacts/smoke.json`.

## Jenkins và SonarQube

Jenkins ở http://127.0.0.1:18081 và SonarQube ở http://127.0.0.1:19000. Khởi động Sonar trước. Chờ trạng thái `UP` rồi chạy bước cấu hình.

```powershell
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

Kiểm tra node `linux-docker` đã Online. Trong job `WorkSphere-Deployment`, chọn **Build with Parameters** và để trống cả hai cờ cho lượt chạy thông thường. Lần đầu agent tải Maven và làm nóng cache. Mở Console Output, Test Result và Artifacts để đối chiếu kết quả.

- Controller có 0 executor. Agent `linux-docker` chạy pipeline và điều khiển Docker local. Job dùng nhánh source tin cậy được chọn khi tạo cấu hình.
- Pipeline kiểm tra SHA app, chạy web/backend với PostgreSQL thử riêng từng build và Testcontainers, lưu JUnit và JaCoCo XML.
- Sonar gửi analysis task ID và webhook tới `http://jenkins:8080/sonarqube-webhook/`. Gate có timeout. Chỉ build/deploy khi gate đạt.
- Chạy riêng một lượt với `FAIL_TEST_DEMO` để xác nhận lỗi kiểm thử chặn deploy. Chạy riêng một lượt với `FAIL_GATE_DEMO` để xác nhận gate ERROR chặn deploy. Cờ thứ hai phân tích project thử riêng có ngưỡng coverage 100%.
- Trên máy đã cấu hình Jenkins, kiểm tra mục SCM của job trước khi đổi nhánh. Lệnh `prepare` dùng tên nhánh đã clone cho bản cài mới và giữ nguyên `.env.ci` đã tồn tại.
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

Dừng theo nhóm bằng `docker @metrics stop`, `docker @ci stop` và `docker @app stop` trong PowerShell đã khai báo các biến trên. Lệnh stop giữ volume. Lần sau dùng các khối khởi động tương ứng với `up -d --no-build` nếu image hiện có đúng commit.

Khi trình bày, đối chiếu build, commit, image ID và ảnh theo [báo cáo Word/PDF](../reports/README.md) và [minh chứng nghiệm thu](../evidence/LOCAL_2026-11-09.md). Trạng thái các hạng mục nộp bài và phần SSH công khai được ghi trong [TODO](../TODO.md).
