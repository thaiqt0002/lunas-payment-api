import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { PayOSEntity } from '../entities'

type IPayosRepo = IBaseRepo<PayOSEntity>
type IRepo = Repository<PayOSEntity>

@Injectable()
export default class PayosRepo extends BaseAbstractRepo<PayOSEntity> implements IPayosRepo {
  public constructor(@InjectRepository(PayOSEntity) private readonly _: IRepo) {
    super(_)
  }
  public updateByUuid(data: Partial<PayOSEntity>, uuid: string) {
    return this._.createQueryBuilder().update().set(data).where('id = :uuid', { uuid }).execute()
  }
}
