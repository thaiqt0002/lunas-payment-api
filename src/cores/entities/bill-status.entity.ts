import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import BillEntity from './bill.entity'
import StatusEntity from './status.entity'

@Entity({ name: 'BillStatus' })
export default class BillStatusEntity {
  @PrimaryColumn({ type: 'char', name: 'bill_uuid', length: 36 })
  billUuid: string

  @PrimaryColumn({ type: 'int', name: 'status_id' })
  statusId: number

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => BillEntity, (bill) => bill.billStatuses)
  @JoinColumn({ name: 'bill_uuid', referencedColumnName: 'uuid' })
  bill: BillEntity

  @ManyToOne(() => StatusEntity, (status) => status.billStatuses)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status: StatusEntity

  @BeforeInsert()
  public beforeInsert() {
    this.createdAt = new Date()
  }

  id: undefined
}
