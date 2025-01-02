export interface IBaseCart {
  uuid: string
  userUuid: string
  variantUuid: string
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export type ICreateCartParams = Pick<IBaseCart, 'userUuid' | 'variantUuid' | 'quantity'>
export type IDeleteCartParams = Pick<IBaseCart, 'userUuid' | 'uuid'>
export type IUpdateCartParams = Pick<IBaseCart, 'userUuid' | 'uuid' | 'quantity'>
