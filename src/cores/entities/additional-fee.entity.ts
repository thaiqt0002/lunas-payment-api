import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import BillEntity from './bill.entity'
import { IBaseAdditionalFee } from '../interfaces'

@Entity({ name: 'AdditionalFee' })
export default class AdditionFeeEntity implements IBaseAdditionalFee {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number

  @Column('varchar', { name: 'bill_uuid', length: 36 })
  billUuid: string

  @Column('text', { name: 'description' })
  description: string

  @Column('float', { name: 'value' })
  value: number

  @Column('int', { name: 'is_paid' })
  isPaid: number

  @Column('bigint', { name: 'order_code' })
  orderCode: number

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date

  @Column('timestamp', { name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => BillEntity, (bill) => bill.additionFees)
  @JoinColumn({ name: 'bill_uuid', referencedColumnName: 'uuid' })
  bill: BillEntity

  @BeforeInsert()
  public insertDates() {
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
  @BeforeUpdate()
  public updateDates() {
    this.updatedAt = new Date()
  }
}
