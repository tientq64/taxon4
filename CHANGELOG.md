# Changelog

### 2.11.2 - 2024-09-30

- Đổi từ `bun` sang `pnpm`, tại `bun` ngốn nhiều RAM.

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
-   Đổi tên mục `phím tắt bàn phím` thành `hướng dẫn`.
-   Đổi logo gấu trúc thành hươu sao.
-   Cải thiện đáng kể hiệu suất mục `phân loại`.

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
