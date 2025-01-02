import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { BillDetailEntity } from '../entities'

type IBillDetailRepo = IBaseRepo<BillDetailEntity>
type IRepo = Repository<BillDetailEntity>

@Injectable()
export default class BillDetailRepo extends BaseAbstractRepo<BillDetailEntity> implements IBillDetailRepo {
  public constructor(@InjectRepository(BillDetailEntity) private readonly _: IRepo) {
    super(_)
  }
}
