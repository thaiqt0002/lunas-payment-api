import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { TransactionInfoEntity } from '../entities'

type ITransactionInfoRepo = IBaseRepo<TransactionInfoEntity>
type IRepo = Repository<TransactionInfoEntity>

@Injectable()
export default class TransactionInfoRepo
  extends BaseAbstractRepo<TransactionInfoEntity>
  implements ITransactionInfoRepo
{
  public constructor(@InjectRepository(TransactionInfoEntity) private readonly _: IRepo) {
    super(_)
  }
}
