import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import BillEntity from './bill.entity'
import TransactionInfoEntity from './transaction-info.entity'
import { IBasePayos } from '../interfaces'

@Entity({ name: 'PayOS' })
export default class PayOSEntity implements IBasePayos {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string

  @Column('bigint', { name: 'order_code' })
  orderCode: number

  @Column('varchar', { name: 'type', length: 100 })
  type: string

  @Column('float', { name: 'amount' })
  amount: number

  @Column('float', { name: 'amount_paid' })
  amountPaid: number

  @Column('float', { name: 'amount_remaining' })
  amountRemaining: number

  @Column('varchar', { name: 'status', length: 255 })
  status: string

  @Column('text', { name: 'checkout_url' })
  checkoutUrl: string

  @Column('text', { name: 'qr_code' })
  qrCode: string

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date

  @Column('timestamp', { name: 'canceled_at' })
  canceledAt: Date | null

  @ManyToOne(() => BillEntity, (bill) => bill.paymentLink)
  @JoinColumn({ name: 'order_code', referencedColumnName: 'orderCode' })
  bill: BillEntity

  @OneToMany(() => TransactionInfoEntity, (transaction) => transaction.payos)
  transactions: TransactionInfoEntity[]

  @BeforeInsert()
  public insertDates() {
    this.createdAt = new Date()
  }
}
