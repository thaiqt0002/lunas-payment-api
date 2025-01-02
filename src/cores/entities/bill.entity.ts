import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import AdditionFeeEntity from './additional-fee.entity'
import BillDetailEntity from './bill-detail.entity'
import BillStatusEntity from './bill-status.entity'
import PaymentMethodEntity from './payment-method.entity'
import PayOSEntity from './payos.entity'
import ServiceFeeEntity from './service-fee.entity'
import StatusEntity from './status.entity'
import TransactionInfoEntity from './transaction-info.entity'
import { IBaseBill } from '../interfaces'

@Entity({ name: 'Bill' })
export default class BillEntity implements IBaseBill {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string

  @Column('char', { name: 'user_uuid', length: 36 })
  userUuid: string

  @Column('bigint', { name: 'order_code', unique: true })
  orderCode: number

  @Column('int', { name: 'service_fee_id' })
  serviceFeeId: number

  @Column('int', { name: 'payment_method_id' })
  paymentMethodId: number

  @Column('varchar', { name: 'customer_email', length: 100 })
  customerEmail: string

  @Column('varchar', { name: 'customer_province', length: 100 })
  customerProvince: string

  @Column('varchar', { name: 'customer_district', length: 100 })
  customerDistrict: string

  @Column('varchar', { name: 'customer_ward', length: 100 })
  customerWard: string

  @Column('varchar', { name: 'customer_street', length: 100 })
  customerStreet: string

  @Column('varchar', { name: 'customer_fullname', length: 100 })
  customerFullname: string

  @Column('varchar', { name: 'customer_phone_number', length: 15 })
  customerPhoneNumber: string

  @Column('char', { name: 'note', length: 255 })
  note: string

  @Column('varchar', { name: 'status', length: 50 })
  status: 'CREATED' | 'APPROVED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED'

  @Column('float', { name: 'amount_total' })
  amountTotal: number

  @Column('float', { name: 'amount_paid' })
  amountPaid: number

  @Column('tinyint', { name: 'is_public' })
  isPublic: number

  @Column('char', { name: 'public_key', length: 255 })
  publicKey: string | null

  @Column('timestamp', { name: 'estimated_delivery_date' })
  estimatedDeliveryDate: Date

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date

  @Column('timestamp', { name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => PayOSEntity, (payos) => payos.bill)
  paymentLink: PayOSEntity[]

  @OneToMany(() => TransactionInfoEntity, (transactionInfo) => transactionInfo.bill)
  transactions: TransactionInfoEntity[]

  @OneToMany(() => AdditionFeeEntity, (additionFee) => additionFee.bill)
  additionFees: AdditionFeeEntity[]

  @OneToMany(() => BillDetailEntity, (billDetail) => billDetail.bill)
  billDetails: BillDetailEntity[]

  @OneToMany(() => BillStatusEntity, (billStatus) => billStatus.bill)
  billStatuses: BillStatusEntity[]

  @ManyToOne(() => ServiceFeeEntity, (serviceFee) => serviceFee.bills)
  @JoinColumn({ name: 'service_fee_id', referencedColumnName: 'id' })
  serviceFee: ServiceFeeEntity

  @ManyToOne(() => PaymentMethodEntity, (paymentMethod) => paymentMethod.bills)
  @JoinColumn({ name: 'payment_method_id', referencedColumnName: 'id' })
  paymentMethod: PaymentMethodEntity

  @ManyToMany(() => StatusEntity, (status) => status.bills)
  @JoinTable({
    name: 'BillStatus',
    joinColumn: { name: 'bill_uuid', referencedColumnName: 'uuid' },
    inverseJoinColumn: { name: 'status_id', referencedColumnName: 'id' },
  })
  statuses: StatusEntity[]

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
