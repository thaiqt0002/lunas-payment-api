export interface ICreateAdditionalFee {
  billUuid: string
  additionalFee: {
    description: string
    value: number
  }
}

export interface IUpdateAdditionalFee {
  billUuid: string
  additionalFee: {
    id: number
    description?: string
    value?: number
  }
}

export interface IDeleteAdditionalFee {
  billUuid: string
  additionalFeeId: number
}
