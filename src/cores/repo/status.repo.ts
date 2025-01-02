import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IBaseRepo } from './base.interface'
import { BaseAbstractRepo } from './base.repo'
import { EStatusType } from '../constants/enum'
import { StatusEntity } from '../entities'

type TStatusRepo = IBaseRepo<StatusEntity>
type TRepo = Repository<StatusEntity>
@Injectable()
export default class StatusRepo extends BaseAbstractRepo<StatusEntity> implements TStatusRepo {
  public constructor(
    @InjectRepository(StatusEntity)
    private readonly _: TRepo,
  ) {
    super(_)
  }

  public updateStatus(status: EStatusType, name: string) {
    return this._.createQueryBuilder().update().set({ name }).where('type = :status', { status }).execute()
  }
}
