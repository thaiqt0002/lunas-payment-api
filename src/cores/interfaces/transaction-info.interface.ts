export interface IBaseTransactionInfo {
  uuid: string // ID giao dịch chuyển khoản
  orderCode: number // Mã đơn hàng
  paymentLinkId: string // ID link thanh toán
  amount: number // Số tiền của giao dịch chuyển khoản
  description: string // Mô tả đơn hàng, được dùng làm nội dung chuyển khoản
  accountNumber: string // Số tài khoản của kênh thanh toán
  transactionDateTime: string // Ngày giờ diễn ra giao dịch chuyển khoản
  currency: string // Đơn vị tiền tệ
  code: string // Mã lỗi
  desc: string // Mô tả lỗi
  counterAccountBankId?: string | null // ID ngân hàng đối ứng
  counterAccountBankName?: string | null // Tên ngân hàng đối ứng
  counterAccountName?: string | null // Tên chủ tài khoản đối ứng
  counterAccountNumber?: string | null // Số tài khoản đối ứng
  virtualAccountName?: string | null // Tên chủ tài khoản ảo
  virtualAccountNumber?: string | null // Số tài khoản ảo
}
