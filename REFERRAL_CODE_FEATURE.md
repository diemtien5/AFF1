# Tính năng Mã Giới Thiệu (Referral Code)

## Tổng quan
Tính năng này cho phép admin quản lý mã giới thiệu cho từng gói vay/thẻ tín dụng và hiển thị tooltip thông tin khi người dùng hover vào nút "ĐĂNG KÝ".

## Các thay đổi đã thực hiện

### 1. Database Schema
- Thêm cột `referral_code` vào bảng `loan_packages`
- Thêm cột `tooltip_enabled` vào bảng `loan_packages`
- Giá trị mặc định: `referral_code = 'CN09XXXX'`, `tooltip_enabled = false`
- Script migration:
  - `scripts/add-referral-code-column.sql`
  - `scripts/add-show-tooltip-column.sql`

### 2. Frontend Components

#### Component RegisterTooltip (`components/register-tooltip.tsx`)
- Tooltip hiển thị khi hover vào nút "ĐĂNG KÝ" (có thể bật/tắt)
- Nội dung tooltip:
  - Tiêu đề: "Lưu ý trong quá trình đăng ký"
  - Hướng dẫn nhập mã giới thiệu
  - Hiển thị mã giới thiệu với nút sao chép
  - Thiết kế: nền trắng, chữ xanh lam, shadow 3D nhẹ
- Props: `referralCode`, `showTooltip` (optional, default: true)

#### Cập nhật Landing Page (`app/page.tsx`)
- Import và sử dụng component `RegisterTooltip`
- Wrap nút "ĐĂNG KÝ" với tooltip
- Lấy dữ liệu `referral_code` từ Supabase

#### Cập nhật Admin Dashboard (`app/admin/dashboard/page.tsx`)
- Thêm trường nhập "Mã giới thiệu" trong phần quản lý gói vay
- Thêm toggle switch "Hiển thị Tooltip" để bật/tắt tooltip
- Cập nhật interface `LoanPackage` để bao gồm `referral_code` và `tooltip_enabled`
- Lưu và cập nhật mã giới thiệu và cài đặt tooltip vào database

### 3. Type Definitions
- Cập nhật interface `LoanPackage` trong `types/index.ts`
- Thêm trường `referral_code?: string` và `tooltip_enabled?: boolean`

## Cách sử dụng

### Cho Admin
1. Đăng nhập vào Admin Dashboard
2. Vào tab "Quản lý gói vay"
3. Tìm trường "Mã giới thiệu" trong mỗi gói vay
4. Nhập mã giới thiệu (ví dụ: CN09XXXX)
5. Bật/tắt toggle "Hiển thị Tooltip" theo nhu cầu dự án
6. Nhấn "Lưu thay đổi"

### Cho Người dùng
1. Hover vào nút "ĐĂNG KÝ" trên bất kỳ thẻ gói vay nào
2. Tooltip sẽ hiển thị thông tin hướng dẫn (nếu được bật)
3. Nhấn nút "Sao chép" để sao chép mã giới thiệu
4. Dán mã vào ô "Mã giới thiệu" khi đăng ký

## Cài đặt Database

Chạy các script SQL sau trong Supabase Dashboard:

```sql
-- Add referral_code column to loan_packages table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loan_packages' AND column_name='referral_code') THEN
    ALTER TABLE loan_packages ADD COLUMN referral_code TEXT DEFAULT 'CN09XXXX';
  END IF;
END $$;

-- Add tooltip_enabled column to loan_packages table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loan_packages' AND column_name='tooltip_enabled') THEN
    ALTER TABLE loan_packages ADD COLUMN tooltip_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;
```

## Tính năng nổi bật

- **Realtime sync**: Mã giới thiệu được đồng bộ realtime từ Supabase
- **Copy to clipboard**: Người dùng có thể sao chép mã một cách dễ dàng
- **Responsive design**: Tooltip hoạt động tốt trên mọi thiết bị
- **Professional UI**: Thiết kế chuyên nghiệp với hiệu ứng 3D và transition mượt mà
- **Admin management**: Admin có thể quản lý mã giới thiệu cho từng gói vay riêng biệt
- **Flexible tooltip control**: Admin có thể bật/tắt tooltip cho từng gói vay theo nhu cầu dự án

## Lưu ý kỹ thuật

- Component `RegisterTooltip` sử dụng `useState` để quản lý trạng thái hiển thị
- Sử dụng `navigator.clipboard.writeText()` để sao chép mã
- Toast notification khi sao chép thành công/thất bại
- Fallback giá trị mặc định nếu `referral_code` không có trong database
- Tooltip chỉ hiển thị khi `tooltip_enabled` được bật (mặc định: false)
- Toggle switch sử dụng component `Switch` từ shadcn/ui
