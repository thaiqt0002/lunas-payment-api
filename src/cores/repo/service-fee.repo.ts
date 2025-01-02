import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { ServiceFeeEntity } from '../entities'

type IServiceFeeRepo = IBaseRepo<ServiceFeeEntity>
type IRepo = Repository<ServiceFeeEntity>

@Injectable()
export default class ServiceFeeRepo extends BaseAbstractRepo<ServiceFeeEntity> implements IServiceFeeRepo {
  public constructor(@InjectRepository(ServiceFeeEntity) private readonly _: IRepo) {
    super(_)
  }

  update(data: { id: number; fee?: number; name?: string; description?: string }) {
    return this._.createQueryBuilder().update().set(data).where('id = :id', { id: data.id }).execute()
  }
}
