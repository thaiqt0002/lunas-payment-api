import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { PaymentMethodEntity } from '../entities'

type IPaymentMethodRepo = IBaseRepo<PaymentMethodEntity>
type IRepo = Repository<PaymentMethodEntity>

@Injectable()
export default class PaymentMethodRepo extends BaseAbstractRepo<PaymentMethodEntity> implements IPaymentMethodRepo {
  public constructor(@InjectRepository(PaymentMethodEntity) private readonly _: IRepo) {
    super(_)
  }
}
