# Changelog

### Ghi chú

Các từ viết tắt:

-   ĐVPL: Đơn vị phân loại

--------------------------------------------------------------------------------

### 3.6.0 - 2025-09-30

-   Cải tiến giao diện popup chi tiết loài khi không tìm thấy dữ liệu.
-   Thêm mô tả khi di chuột vào các nút thanh bên.
-   Thêm nhiều nội dung hữu ích cho một số mục thanh bên. Một số mục bây giờ cũng hiện mô tả từ Wikipedia khi di chuột vào.
-   Thêm phông chữ "Segoe UI Variable Display", và cũng đặt làm phông chữ mặc định.
-   Thêm đánh dấu các kết quả tìm kiếm vào cạnh thanh cuộn.
-   Sử dụng twemoji để hiển thị emoji. Các icon cờ cũng được thay thế bằng twemoji.
-   Cải thiện giao diện cửa sổ tìm kiếm.
-   Cải thiện giao diện phần tử select.
-   Tooltip bây giờ có giao diện giống với popover.
-   Loại bỏ tùy chọn ngôn ngữ popup, thay vào đó sử dụng ngôn ngữ ứng dụng.
-   Dev: Đổi sang giao diện tối cho iNaturalist, vì trang đó không có giao diện tối.

### 3.5.1 - 2025-09-06

-   Cải thiện giao diện.
-   Dev: Sử dụng cú pháp (()) cho interpolate trong i18n.

### 3.5.0 - 2025-08-06

-   Có thể xem số lượng dòng trong tập tin dữ liệu của một ĐVPL nếu nó được tách ra thành một tập tin riêng.
-   Dev: Hạ cấp thư viện chokidar từ v4 xuống v3, vì v4 không hỗ trợ glob.

### 3.4.0 - 2025-08-01

-   Chia nhỏ file data ra thành các file con, hạn chế rủi ro mất dữ liệu khi lưu.
-   Dev: Viết lại cách watch các tập tin khi dev.

### 3.3.0 - 2025-07-27

-   Local: Mất kha khá dữ liệu đã thu thập trong data.taxon4, do VSCode bị crash khi lưu, chỉ lưu được đến đoạn loài Lemur, còn lại phục hồi từ trên GitHub. 👎VSCode!

### 3.2.0 - 2025-06-22

-   Thêm xác định các giống là lai ghép, được bắt đầu bằng dấu `+` trước tên.
-   Thêm tùy chọn thay đổi ngôn ngữ app, bao gồm: tiếng Việt, tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Tây Ban Nha.
-   Thêm hiển thị thời điểm hóa thạch trong popup khi một loài đã tuyệt chủng hàng triệu năm trước, hoặc hiển thị năm tuyệt chủng nếu chỉ mới tuyệt chủng gần đây.
-   Danh sách trong mục `Phân loại` và `Các bậc phân loại` được thiết kế lại dễ nhìn hơn.
-   Khi di chuột vào ĐVPL trong trang xem, sẽ hiển thị ĐVPL đó như ĐVPL hiện tại trong mục `Phân loại`.
-   Bắt đầu làm phần thống kê, đã thêm vài thông tin cơ bản.
-   Thiết kế lại phần tử `Select`.
-   Thiết kế lại thanh bên đẹp hơn.

### 3.1.4 - 2025-06-04

-   Dev: Thêm trang chỉnh sửa viewbox của hình ảnh.

### 3.1.3 - 2025-06-02

-   Dev: Thêm tính năng upload ảnh lên GitHub, Imgbb.
-   Dev: Loại bỏ `zustand`, thay bằng `valtio`.

### 3.1.1 - 2025-05-31

-   Đổi phông chữ mặc định thành `Archivo`.
-   Loại bỏ `eslint` cho đỡ phức tạp.
-   Cập nhật TailwindCSS v3 lên v4, loại bỏ PostCSS.

### 3.1.0 - 2025-05-08

-   Định dạng tên khoa học cho bậc mục (vd: Nuphar sect. Astylus).
-   Thêm tình trạng candidatus cho ĐVPL, ký hiệu bằng dấu `~` sau tên.

### 3.0.0 - 2025-05-01

-   Bắt đầu thêm dữ liệu cho giới Protista (Sinh vật nguyên sinh).

### 2.16.0 - 2025-03-01

-   Thêm cấp bậc phân đội.
-   Cập nhật lại đội Tectipleura.

### 2.14.10 - 2025-02-02

-   Dev: Thêm tính năng upload ảnh lên Imgur.

### 2.14.2 - 2024-10-24

-   Sửa lỗi đầu ra khi build.

### 2.14.1 - 2024-10-23

-   Cải thiện phần hiển thị tình trạng bảo tồn.

### 2.14.0 - 2024-10-21

-   Thêm mục `Các tình trạng bảo tồn`.
-   Thiết kế lại mục `Các bậc phân loại`.

### 2.13.0 - 2024-10-16

-   Thêm nhiều tùy chọn trong cài đặt.
-   Cải thiện minimap.

### 2.12.0 - 2024-10-10

-   Thêm minimap.

### 2.11.2 - 2024-09-30

-   Đổi từ `bun` sang `pnpm`, tại `bun` ngốn nhiều RAM.

### 2.11.0 - 2024-09-30

-   Thêm lệnh trong VSCode extension tự động điền hàng loạt tên tiếng Anh.

### 2.10.0 - 2024-09-27

-   Thêm tính năng copy tên tiếng Anh của loài lấy từ Wikipedia, trong chế độ nhà phát triển.
-   Tách nhỏ một số đoạn code ra thành các component con.

### 2.9.0 - 2024-09-24

-   Cải thiện phần hiển thị tình trạng bảo tồn.
-   Ghi nguồn Wikipedia khi xem mô tả loài.
-   Cải thiện đáng kể hiệu suất, bằng cách viết lại state mà dùng `react context`.

### 2.8.0 - 2024-09-23

-   Hiển thị thông tin tình trạng bảo tồn của loài.

### 2.7.0 - 2024-09-22

-   Cải thiện code ảnh từ nguồn `reptile-database`.
-   Thêm quyền `onurlchange` trong userscript, để phát hiện URL thay đổi đối với các website PWA.

### 2.6.0 - 2024-09-20

-   Thêm thông tin trong popup chi tiết loài.
-   Thêm viewBox cho hình ảnh.
-   Thêm tính năng cuộn nhanh khi giữ phím `Alt`.
-   Đổi tên mục `Phím tắt bàn phím` thành `Hướng dẫn`.
-   Đổi logo gấu trúc thành hươu sao.
-   Cải thiện đáng kể hiệu suất mục `Phân loại`.

### 2.5.0 - 2024-09-14

-   Đổi logo khỉ đột thành gấu trúc.
-   Thêm popup tìm kiếm, mở bằng phím `F`.
-   Thêm tab xem phím tắt bàn phím.
-   Thêm nhiều loài, icon.

### 2.4.0 - 2024-09-03

-   Hiển thị icon đại diện trong popup.
-   Thêm cài đặt chế độ nhà phát triển.

### 2.3.0 - 2024-09-01

-   Chuyển từ `react context` sang `zustand`.
-   Có thể tự phát hiện các từ tên riêng trong tên loài khi thu thập.
-   Cải thiện nhiều thứ khác.

### 2.2.1 - 2024-08-31

-   Cải thiện đáng kể hiệu suất.

### 2.2.0 - 2024-08-29

-   Thêm phần xem các bậc phân loại.
-   Quét tìm lỗi tập tin [data.taxon4](./public/data/data.taxon4) trước khi hiển thị.
-   Cải thiện khả năng định vị trí của popup.

### 2.1.0 - 2024-08-28

-   Cải thiện popup xem chi tiết loài, nhìn đẹp hơn.
-   Có thể thay đổi ngôn ngữ popup.

### 2.0.0 - 2024-08-27

-   Đổi JS framework từ `mithril` sang `react`.
-   Thêm tính năng popup xem chi tiết loài khi di chuột vào.
-   Tách code ra thành các component con.

### 1.0.1 - 2024-08-25

-   Bao gồm các chức năng cơ bản.
