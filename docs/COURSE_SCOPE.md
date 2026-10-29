# Yêu cầu môn Triển khai từ mẫu đã cung cấp

Nguồn: “Mẫu báo cáo Trien khai phan mem.docx” của người dùng; các số Dxxx là số đoạn/bảng do trích xuất gán, không phải số mục gốc của giảng viên.

| Mã | Yêu cầu | Việc phải làm | Trạng thái |
| --- | --- | --- | --- |
| D048-D057 | Tổng quan, kiến trúc, yêu cầu máy/ngôn ngữ/DB, sơ đồ CI/CD và cấu phần | Viết đúng bản app đã chốt | Kế hoạch |
| D058 | Mục CI/CD tối đa 5 điểm | Không suy ra tổng điểm học phần | Tiêu chí tham chiếu |
| D059 | Jenkins trên máy tính cá nhân | Cài, cấu hình node/tools/credential và job | TODO |
| D060 | Khuyến khích Jenkinsfile | Lưu pipeline trong Git | TODO |
| D061 | Sonar tích hợp Jenkins bắt buộc, thiếu -1 | Analysis + webhook + quality gate | TODO |
| D062 | Docker/docker-compose bắt buộc, không đóng gói được → trượt theo mẫu | Build app image, Compose app+DB, health/volume | TODO |
| D063-D064 | Ảnh thật, gộp một quyển; copy kết quả có thể cả hai trượt | Thu ảnh build/commit/digest tự chạy, che secret | TODO |
| D065-D069 | SSH deploy server public là bonus +1 | Pipeline public sau khi local đạt; URL hoạt động | OPTIONAL/TODO |
| D070-D075 | Prometheus/Grafana local, thiếu -1 | Scrape + dashboard có dữ liệu, mô tả cài đặt | TODO |
| D076-D079 | Kết luận/cải tiến pipeline và phần mềm | Nêu kết quả thật và giới hạn | TODO |
| D003,D007-D008 | Phân công, tự đánh giá 30%, giảng viên 70% | Điền thông tin thật và việc có bằng chứng | TODO |

Không đưa ngày 2025 có sẵn trên bìa mẫu thành ngày nộp hiện tại. Ngày thi/nộp chính xác chưa được xác nhận. Báo cáo audit app không thay quyển minh chứng triển khai đã thực hiện.
