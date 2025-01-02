import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { BillEntity } from '../entities'

type IBillRepo = IBaseRepo<BillEntity>
type IRepo = Repository<BillEntity>

@Injectable()
export default class BillRepo extends BaseAbstractRepo<BillEntity> implements IBillRepo {
  public constructor(@InjectRepository(BillEntity) private readonly _: IRepo) {
    super(_)
  }

  public updateEstimatedDeliveryDateByUuid(billUuid: string, estimatedDeliveryDate: Date) {
    return this._.createQueryBuilder()
      .update(BillEntity)
      .set({ estimatedDeliveryDate })
      .where('uuid = :billUuid', { billUuid })
      .execute()
  }

  public updateBillByUuid(billUuid: string, data: DeepPartial<BillEntity>) {
    return this._.createQueryBuilder().update(BillEntity).set(data).where('uuid = :billUuid', { billUuid }).execute()
  }
}
