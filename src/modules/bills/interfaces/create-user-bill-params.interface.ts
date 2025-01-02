export interface ICreateUserBillItem {
  variantUuid: string
  quantity: number
  price: number
  metadata: {
    productName: string
    variantName: string
    variantImage: string
  }
}
export interface ICreateUserBillPayload {
  userUuid: string
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
  amountTotal: number
  amountPaid: number
  items: ICreateUserBillItem[]
}

export interface ICmsCreateUserBillPayload {
  paymentMethodId: number
  items: ICreateUserBillItem[]
}

export interface IUpdatePublicBill {
  orderCode: number
  serviceFeeId: number
  customerEmail: string
  customerProvince: string
  customerDistrict: string
  customerWard: string
  customerStreet: string
  customerFullname: string
  customerPhoneNumber: string
  amountTotal: number
  amountPaid: number
  note: string
  publicKey: string
}
