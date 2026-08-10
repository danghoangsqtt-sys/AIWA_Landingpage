# Hướng dẫn đưa website AIWA lên Vercel

Bộ mã này đã được chuyển sang **Next.js chuẩn cho Vercel**. Thông tin khách hàng được ghi vào Google Sheets trước, sau đó hệ thống gửi thư cảm ơn bằng Resend và chuyển người đăng ký đến Zalo 0343 019 101.

## 1. Chuẩn bị

Bạn cần:

- Một tài khoản GitHub.
- Một tài khoản Vercel.
- Một tài khoản Google để tạo Google Sheet.
- Một tài khoản Resend và tên miền đã xác minh nếu muốn gửi email cho khách hàng.

Không đăng API key, mật khẩu hoặc mã bí mật lên GitHub. Không gửi các giá trị này trong tin nhắn.

## 2. Tạo bảng quản lý khách hàng

1. Truy cập https://sheets.google.com và tạo một bảng tính trống.
2. Trong đường dẫn của bảng, sao chép đoạn nằm giữa `/d/` và `/edit`. Đây là **ID bảng tính**.
3. Trong Google Sheet chọn **Tiện ích mở rộng → Apps Script**.
4. Xóa mã mẫu, sau đó sao chép toàn bộ nội dung tệp `integrations/google-sheets-apps-script.js` vào trình soạn thảo và lưu lại.
5. Mở **Project Settings → Script Properties**, tạo hai thuộc tính:
   - `AIWA_SHEET_ID`: dán ID bảng tính ở bước 2.
   - `AIWA_WEBHOOK_SECRET`: tự đặt một chuỗi dài và khó đoán, ví dụ ít nhất 32 ký tự.
6. Chọn **Deploy → New deployment → Web app**.
7. Chọn:
   - **Execute as:** Me.
   - **Who has access:** Anyone.
8. Cho phép Apps Script truy cập bảng tính, hoàn tất triển khai và sao chép URL kết thúc bằng `/exec`.

Khi có khách đăng ký lần đầu, Apps Script tự tạo trang `Khách hàng AIWA`, tiêu đề cột, màu sắc và danh sách lựa chọn. Không cần tự nhập tiêu đề.

## 3. Cấu hình gửi email bằng Resend

1. Truy cập https://resend.com và tạo tài khoản.
2. Trong Resend, thêm tên miền gửi thư và làm theo hướng dẫn thêm bản ghi DNS để xác minh.
3. Tạo API key mới và chỉ sao chép một lần để lưu ở nơi an toàn.
4. Chọn địa chỉ gửi thuộc tên miền đã xác minh, ví dụ:

   `AIWA by DHSystem <hello@tenmiencuaban.vn>`

Website vẫn ghi khách hàng vào Google Sheets nếu Resend tạm thời lỗi; trạng thái trên biểu mẫu sẽ cho biết email có được gửi hay không.

## 4. Đưa mã nguồn lên GitHub

1. Giải nén bộ mã nguồn.
2. Tạo một repository GitHub mới, ví dụ `aiwa-dhsystem`.
3. Tải toàn bộ nội dung trong thư mục đã giải nén lên repository. Tệp `package.json` phải nằm ở thư mục gốc.
4. Không tải tệp `.env.local` lên GitHub.

## 5. Deploy trên Vercel

1. Truy cập https://vercel.com/new và chọn **Import Git Repository**.
2. Chọn repository `aiwa-dhsystem`.
3. Vercel sẽ tự nhận diện **Next.js**. Giữ nguyên các thiết lập Build và nhấn **Deploy**.
4. Sau lần deploy đầu, mở **Project → Settings → Environment Variables** và thêm bốn biến:

| Tên biến | Giá trị |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL Apps Script kết thúc bằng `/exec` |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Chuỗi bí mật giống `AIWA_WEBHOOK_SECRET` |
| `RESEND_API_KEY` | API key tạo trong Resend |
| `RESEND_FROM_EMAIL` | `AIWA by DHSystem <hello@tenmiencuaban.vn>` |

5. Đánh dấu `GOOGLE_SHEETS_WEBHOOK_SECRET` và `RESEND_API_KEY` là dữ liệu nhạy cảm nếu Vercel hiển thị lựa chọn này.
6. Chọn áp dụng cho **Production**, **Preview** và **Development** nếu bạn muốn thử trên mọi môi trường.
7. Mở mục **Deployments** và chạy **Redeploy** để bản mới nhận các biến cấu hình.

## 6. Kiểm tra toàn bộ quy trình

1. Mở đường dẫn Vercel và vào trang đăng ký.
2. Dùng một email của bạn để đăng ký thử.
3. Kiểm tra một dòng mới xuất hiện trong trang `Khách hàng AIWA`.
4. Kiểm tra email cảm ơn, cả hộp thư đến và thư rác.
5. Kiểm tra trang tự mở Zalo 0343 019 101.
6. Đảm bảo thư mục Google Drive chứa bộ cài đã bật quyền **Bất kỳ ai có liên kết đều có thể xem**.

## 7. Quản lý khách hàng trong Google Sheets

Mỗi đăng ký có các cột:

- STT, họ và tên, số điện thoại và email.
- Key miễn phí đang sử dụng.
- Thời gian bắt đầu dùng thử.
- Đã mua hay chưa mua.
- Mức độ tương tác.
- Đã tham gia nhóm hỗ trợ hay chưa.

Sau khi cấp key hoặc chăm sóc khách hàng, bạn chỉ cần mở bảng và cập nhật các cột trạng thái bằng danh sách lựa chọn.

## 8. Xử lý lỗi thường gặp

- **Không có dòng mới trong Sheets:** kiểm tra URL phải kết thúc bằng `/exec`, hai mã bí mật phải giống nhau và Apps Script đã cấp quyền truy cập.
- **Đã sửa Apps Script nhưng website vẫn lỗi:** tạo deployment/version mới trong Apps Script rồi cập nhật lại URL nếu Google cấp URL khác.
- **Sheets có dữ liệu nhưng không nhận email:** kiểm tra API key, tên miền đã xác minh và `RESEND_FROM_EMAIL`.
- **Vercel vừa thêm biến nhưng vẫn lỗi:** Redeploy bản mới; thay đổi biến môi trường không tự áp dụng cho deployment cũ.
- **Khách không tải được bộ cài:** kiểm tra quyền chia sẻ thư mục Google Drive.

Tài liệu chính thức tham khảo:

- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Resend với Next.js: https://resend.com/docs/send-with-nextjs
- Google Apps Script Web Apps: https://developers.google.com/apps-script/guides/web
