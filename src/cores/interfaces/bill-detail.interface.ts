export interface IBaseBillDetail {
  variantUuid: string
  billUuid: string
  quantity: number
  price: number
  metadata: Record<string, any>
}
