import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import BillEntity from './bill.entity'
import BillStatusEntity from './bill-status.entity'
import { EStatusType } from '../constants/enum'
import { IBaseStatus } from '../interfaces'

@Entity({ name: 'Status' })
export default class StatusEntity implements IBaseStatus {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number

  @Column('varchar', { name: 'type', length: 50 })
  type: EStatusType

  @Column('varchar', { name: 'name', length: 50 })
  name: string

  @Column('timestamp', { name: 'created_at' })
  createdAt: Date

  @Column('timestamp', { name: 'updated_at' })
  updatedAt: Date

  @ManyToMany(() => BillEntity, (bill) => bill.statuses)
  bills: BillEntity[]

  @OneToMany(() => BillStatusEntity, (billStatus) => billStatus.status)
  billStatuses: BillStatusEntity[]

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
