import { EStatusType } from '../constants/enum'

export interface IBaseStatus {
  id: number
  type: EStatusType
  name: string
  createdAt: Date
  updatedAt: Date
}
