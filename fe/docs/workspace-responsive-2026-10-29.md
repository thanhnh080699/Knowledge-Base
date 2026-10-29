# Cảnh Khám phá trên màn nhỏ

Ngày 2026-10-29. Chỉ sửa `story-motion.css` và `lib/story-motion.ts` cho cảnh
workspace, theo phương án responsive được người dùng đồng ý triển khai thử.
Không thay bố cục Top Repos đã rollback.

- CSS và GSAP dùng cùng breakpoint 900 px, kể cả phép tính fitCanvas.
- Dưới 900 px: ba hàng ngang riêng, icon trái, nội dung giữa, mũi tên phải;
  hiện lần lượt bằng opacity và dịch lên 26 px, không scale/rotate/fan ngang.
- Từ 900 px: giữ chuyển động bung ngang và bố cục desktop ban đầu.
- Màn dưới 900 px và cao tối đa 560 px: scene 640 px cuộn tự nhiên, tắt pin,
  giữ chữ đọc được và cho phép cuộn xuống đủ ba hàng.
- Điện thoại dọc cao 561–650 px: nâng canvas 24 px để nút về đầu trang không
  che nội dung cuối, không tiếp tục thu nhỏ chữ.

Production build, TypeScript, scoped ESLint và git diff --check qua.
Browser automation qua các viewport 320×568, 390×844, 672×912 (gần ảnh báo lỗi),
768×1024, 899×900, 900×900, 1440×1000, 844×390; thêm đổi kích thước
672 → 1000 → 672. Ở cuối cảnh trên màn hẹp: cả ba thẻ có opacity 1, không
chồng hình chữ nhật, không tràn chiều cao/nội dung, không tràn ngang, chữ không
bị nút về đầu trang che. Không pageerror trong các lượt chạy.
Chụp và kiểm tra trực quan màn hẹp, tablet, desktop và màn ngang thấp.

Chưa deploy; đây là kiểm tra browser local, không phải xác nhận trên thiết bị
vật lý hay phép đo PageSpeed mới.
