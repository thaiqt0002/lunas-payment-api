import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import CartEntity from '../entities/cart.entity'

type ICartRepo = IBaseRepo<CartEntity>
type IRepo = Repository<CartEntity>
@Injectable()
class CartRepo extends BaseAbstractRepo<CartEntity> implements ICartRepo {
  public constructor(@InjectRepository(CartEntity) private readonly _: IRepo) {
    super(_)
  }

  public deleteByUserUuidAndVariantUuid(userUuid: string, variantUuids: string[]) {
    return this._.createQueryBuilder()
      .delete()
      .from(CartEntity)
      .where('user_uuid = :userUuid and variant_uuid IN (:...variantUuids)', { userUuid, variantUuids })
      .execute()
  }
}
export default CartRepo
