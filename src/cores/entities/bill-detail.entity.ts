import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import BillEntity from './bill.entity'
import { IBaseBillDetail } from '../interfaces'

@Entity({ name: 'BillDetail' })
export default class BillDetailEntity implements IBaseBillDetail {
  @PrimaryColumn({ type: 'char', name: 'bill_uuid', length: 36 })
  billUuid: string

  @PrimaryColumn({ type: 'char', name: 'variant_uuid', length: 36 })
  variantUuid: string

  @Column({ type: 'int', name: 'quantity' })
  quantity: number

  @Column({ type: 'int', name: 'price' })
  price: number

  @Column({ type: 'json', name: 'metadata' })
  metadata: {
    productName: string
    variantName: string
    variantImage: string
  }

  @ManyToOne(() => BillEntity, (bill) => bill.billDetails)
  @JoinColumn({ name: 'bill_uuid', referencedColumnName: 'uuid' })
  bill: BillEntity

  id: undefined
}
