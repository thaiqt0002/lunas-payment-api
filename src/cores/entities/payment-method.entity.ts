import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import BillEntity from './bill.entity'
import { IBasePaymentMethod } from '../interfaces'

@Entity({ name: 'PaymentMethod' })
export default class PaymentMethodEntity implements IBasePaymentMethod {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number

  @Column('varchar', { name: 'name', length: 100 })
  name: string

  @Column('varchar', { name: 'type', length: 100 })
  type: string

  @OneToMany(() => BillEntity, (bill) => bill.paymentMethod)
  bills: BillEntity[]
}
