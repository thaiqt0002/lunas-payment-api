import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { AdditionFeeEntity } from '../entities'

type IAdditionalFeeRepo = IBaseRepo<AdditionFeeEntity>
type IRepo = Repository<AdditionFeeEntity>

@Injectable()
export default class AdditionalFeeRepo extends BaseAbstractRepo<AdditionFeeEntity> implements IAdditionalFeeRepo {
  public constructor(@InjectRepository(AdditionFeeEntity) private readonly _: IRepo) {
    super(_)
  }

  public updateAdditionalFee = (
    billUuid: string,
    additionalFee: { id: number; value?: number; description?: string },
  ) =>
    this._.createQueryBuilder()
      .update()
      .set(additionalFee)
      .where('id = :id AND billUuid = :billUuid', { id: additionalFee.id, billUuid })
      .execute()

  public updateManyIsPaid = (billUuid: string, additionalFeeIds: number[], orderCode: number) =>
    this._.createQueryBuilder()
      .update()
      .set({ isPaid: 1, orderCode })
      .where('billUuid = :billUuid AND id IN (:...additionalFeeIds)', { billUuid, additionalFeeIds })
      .execute()
}
