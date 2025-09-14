-- Insert sample loan packages with affiliate links
INSERT INTO loan_packages (name, slug, description, loan_limit, interest_rate, disbursement_speed, logo, image, register_link, detail_link, referral_code, tooltip_enabled) VALUES
('Vay Tnex', 'vay-tnex', 'Gói vay tín chấp linh hoạt dành cho khách hàng cá nhân. Hồ sơ đơn giản, đăng ký nhanh qua app hoặc Zalo.', 'Tối đa 100.000.000 ₫', 'Từ 1.2%/tháng', 'Trong 30 phút', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://tnex.com.vn/register', 'https://tnex.com.vn/details', 'CN09XXXX', true),
('Vay Lotte', 'vay-lotte', 'Vay tiêu dùng không thế chấp từ Lotte Finance. Lãi suất ưu đãi, thủ tục nhanh gọn.', 'Tối đa 80.000.000 ₫', 'Từ 1.5%/tháng', 'Trong 2 giờ', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://lotte.com.vn/register', 'https://lotte.com.vn/details', 'CN09XXXX', true),
('Thẻ Muadee', 'the-muadee', 'Thẻ tín dụng Muadee với hạn mức cao, nhiều ưu đãi mua sắm và hoàn tiền.', 'Tối đa 50.000.000 ₫', 'Từ 2.0%/tháng', 'Trong 1 giờ', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://muadee.com/register', 'https://muadee.com/details', 'CN09XXXX', true),
('Vay CUB', 'vay-cub', 'Gói vay cá nhân từ ngân hàng CUB với lãi suất cạnh tranh và thủ tục đơn giản.', 'Tối đa 200.000.000 ₫', 'Từ 1.0%/tháng', 'Trong 4 giờ', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://cub.com.vn/register', 'https://cub.com.vn/details', 'CN09XXXX', true),
('Vay FCredit', 'vay-fcredit', 'Vay tiêu dùng FE Credit với quy trình online hoàn toàn, duyệt nhanh 24/7.', 'Tối đa 150.000.000 ₫', 'Từ 1.8%/tháng', 'Trong 1 giờ', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://fecredit.com.vn/register', 'https://fecredit.com.vn/details', 'CN09XXXX', true),
('Thẻ tín dụng VIB', 'the-vib', 'Thẻ tín dụng VIB với nhiều ưu đãi du lịch, mua sắm và hoàn tiền cao.', 'Tối đa 100.000.000 ₫', 'Từ 2.5%/tháng', 'Trong 3 giờ', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://vib.com.vn/register', 'https://vib.com.vn/details', 'CN09XXXX', true),
('Thẻ tín dụng VPBank', 'the-vpbank', 'Thẻ tín dụng VPBank với lãi suất ưu đãi và nhiều tiện ích thanh toán.', 'Tối đa 120.000.000 ₫', 'Từ 2.2%/tháng', 'Trong 2 giờ', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://vpbank.com.vn/register', 'https://vpbank.com.vn/details', 'CN09XXXX', true),
('Thẻ tín dụng HDBank', 'the-hdbank', 'Thẻ tín dụng HDBank với hạn mức linh hoạt và nhiều chương trình khuyến mãi.', 'Tối đa 90.000.000 ₫', 'Từ 2.3%/tháng', 'Trong 4 giờ', '/placeholder.svg?height=40&width=40', '/placeholder.svg?height=150&width=300', 'https://hdbank.com.vn/register', 'https://hdbank.com.vn/details', 'CN09XXXX', true);

-- Insert consultant information
INSERT INTO consultants (name, avatar, phone, zalo, zalo_link, facebook, credit_cards, loans, ewallets) VALUES
('Nguyễn Thành Phúc', '/placeholder.svg?height=192&width=192', '0888.979.809', '0888.979.809', 'https://zalo.me/0888979809', 'Tên Facebook hoặc Icon', 'VIB, HDBank, VPBank', 'TNEX, LOTTE, FE Credit', 'MUADEE, Kredivo, MoMo');

-- Insert navbar links
INSERT INTO navbar_links (title, url) VALUES
('Thẻ Muadee', 'https://muadee.com'),
('Vay Tnex', 'https://tnex.com.vn'),
('Vay FE', 'https://fecredit.com.vn'),
('Vay CUB', 'https://cub.com.vn');

-- Insert admin user
INSERT INTO admin_users (username, password, role) VALUES
('haidang', '123456', 'admin');

-- Insert analytics stats
INSERT INTO analytics_stats (type, value) VALUES
('total_approved', 6170),
('success_rate', 87),
('pending_review', 950);
