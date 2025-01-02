export interface IBasePayos {
  id: string
  orderCode: number
  type: string
  amount: number
  amountPaid: number
  amountRemaining: number
  status: string
  checkoutUrl: string
  qrCode: string
  createdAt: Date
  canceledAt: Date
}
