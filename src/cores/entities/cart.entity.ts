import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { IBaseCart } from '../interfaces/cart.interface'

@Entity({ name: 'Cart' })
class CartEntity implements IBaseCart {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid!: string

  @Column('char', { name: 'user_uuid', length: 36 })
  userUuid: string

  @Column('char', { name: 'variant_uuid', length: 36 })
  variantUuid: string

  @Column('int', { name: 'quantity' })
  quantity: number

  @Column('timestamp', { name: 'created_at' })
  createdAt!: Date

  @Column('timestamp', { name: 'updated_at' })
  updatedAt!: Date

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
export default CartEntity
