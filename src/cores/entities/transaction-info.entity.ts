import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import BillEntity from './bill.entity'
import PayOSEntity from './payos.entity'
import { IBaseTransactionInfo } from '../interfaces'

@Entity({ name: 'TransactionInfo' })
export default class TransactionInfoEntity implements IBaseTransactionInfo {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string

  @Column('bigint', { name: 'order_code' })
  orderCode: number

  @Column('varchar', { name: 'payment_link_id', length: 255 })
  paymentLinkId: string

  @Column('int', { name: 'amount' })
  amount: number

  @Column('text', { name: 'description' })
  description: string

  @Column('varchar', { name: 'account_number', length: 255 })
  accountNumber: string

  @Column('varchar', { name: 'transaction_date_time', length: 255 })
  transactionDateTime: string

  @Column('varchar', { name: 'currency', length: 255 })
  currency: string

  @Column('varchar', { name: 'code', length: 255 })
  code: string

  @Column('varchar', { name: 'desc', length: 255 })
  desc: string

  @Column('varchar', { name: 'counter_account_bank_id', length: 255 })
  counterAccountBankId: string

  @Column('varchar', { name: 'counter_account_bank_name', length: 255 })
  counterAccountBankName: string

  @Column('varchar', { name: 'counter_account_name', length: 255 })
  counterAccountName: string

  @Column('varchar', { name: 'counter_account_number', length: 255 })
  counterAccountNumber: string

  @Column('varchar', { name: 'virtual_account_name', length: 255 })
  virtualAccountName: string

  @Column('varchar', { name: 'virtual_account_number', length: 255 })
  virtualAccountNumber: string

  @ManyToOne(() => PayOSEntity, (payos) => payos.transactions)
  @JoinColumn({ name: 'payment_link_id', referencedColumnName: 'id' })
  payos: PayOSEntity

  @ManyToOne(() => BillEntity, (bill) => bill.transactions)
  @JoinColumn({ name: 'order_code', referencedColumnName: 'orderCode' })
  bill: BillEntity
}
