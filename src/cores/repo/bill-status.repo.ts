import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { BillStatusEntity } from '../entities'

type IBillStatusRepo = IBaseRepo<BillStatusEntity>
type IRepo = Repository<BillStatusEntity>

@Injectable()
export default class BillStatusRepo extends BaseAbstractRepo<BillStatusEntity> implements IBillStatusRepo {
  public constructor(@InjectRepository(BillStatusEntity) private readonly _: IRepo) {
    super(_)
  }
}
