import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import BillEntity from './bill.entity'
import { IBaseServiceFee } from '../interfaces'

@Entity({ name: 'ServiceFee' })
export default class ServiceFeeEntity implements IBaseServiceFee {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number

  @Column('varchar', { name: 'type', length: 50 })
  type: string

  @Column('varchar', { name: 'name', length: 50 })
  name: string

  @Column('varchar', { name: 'description', length: 255 })
  description: string

  @Column('float', { name: 'fee' })
  fee: number

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date

  @Column('timestamp', { name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => BillEntity, (bill) => bill.serviceFee)
  bills: BillEntity[]

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
