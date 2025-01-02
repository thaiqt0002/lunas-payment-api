export interface IBaseBill {
  uuid: string
  orderCode: number
  serviceFeeId: number
  paymentMethodId: number
  customerEmail: string
  customerProvince: string
  customerDistrict: string
  customerWard: string
  customerStreet: string
  customerFullname: string
  customerPhoneNumber: string
  note: string
  status: 'CREATED' | 'APPROVED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED'
  amountTotal: number
  amountPaid: number
  isPublic: number
  publicKey: string | null

  estimatedDeliveryDate: Date

  createdAt: Date
  updatedAt: Date
}
