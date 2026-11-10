# Yêu cầu môn Triển khai từ mẫu đã cung cấp

Nguồn: “Mẫu báo cáo Trien khai phan mem.docx” của người dùng; các số Dxxx là số đoạn/bảng do trích xuất gán, không phải số mục gốc của giảng viên.

| Mã | Yêu cầu | Việc phải làm | Trạng thái |
| --- | --- | --- | --- |
| D048-D057 | Tổng quan, kiến trúc, yêu cầu máy/ngôn ngữ/DB, sơ đồ CI/CD và cấu phần | Viết đúng bản app đã chốt | Có trong báo cáo tiến độ |
| D058 | Mục CI/CD tối đa 5 điểm | Không suy ra tổng điểm học phần | Tiêu chí tham chiếu |
| D059 | Jenkins trên máy tính cá nhân | Cài, cấu hình node/tools/credential và job | Nghiệm thu local với #5 |
| D060 | Khuyến khích Jenkinsfile | Lưu pipeline trong Git | Có tại `jenkins/Jenkinsfile` |
| D061 | Sonar tích hợp Jenkins bắt buộc, thiếu -1 | Analysis + webhook + quality gate | #5 gate OK, #6 chặn deploy khi gate ERROR |
| D062 | Docker/docker-compose bắt buộc, không đóng gói được → trượt theo mẫu | Build app image, Compose app+DB, health/volume | Compose healthy và smoke đạt |
| D063-D064 | Ảnh thật, gộp một quyển; copy kết quả có thể cả hai trượt | Thu ảnh tự chạy, lưu cùng phiên bản | Có phụ lục báo cáo và hồ sơ nghiệm thu |
| D065-D069 | SSH deploy server public là bonus +1 | Pipeline public sau khi local đạt; URL hoạt động | Chờ máy chủ cho phần cộng điểm |
| D070-D075 | Prometheus/Grafana local, thiếu -1 | Scrape + dashboard có dữ liệu, mô tả cài đặt | Nghiệm thu UP → DOWN → UP và dashboard |
| D076-D079 | Kết luận/cải tiến pipeline và phần mềm | Nêu kết quả thật và giới hạn | Có trong báo cáo tiến độ |
| D003,D007-D008 | Phân công, tự đánh giá 30%, giảng viên 70% | Điền thông tin thật và việc có bằng chứng | Nhóm điền trên bản Word nộp lớp |

Xem [báo cáo trình bày ngày 11/11/2026](../reports/README.md) và [kết quả nghiệm thu local ngày 09/11/2026](../evidence/LOCAL_2026-11-09.md).
