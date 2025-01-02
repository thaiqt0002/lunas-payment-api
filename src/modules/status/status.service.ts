import { Injectable } from '@nestjs/common'

import { EStatusType } from '~/cores/constants/enum'
import { StatusRepo } from '~/cores/repo'

@Injectable()
export default class StatusService {
  constructor(private readonly statusRepo: StatusRepo) {}

  public getStatusList() {
    return this.statusRepo.findAll({
      select: {
        id: true,
        type: true,
        name: true,
      },
    })
  }

  public updateStatus(status: EStatusType, name: string) {
    return this.statusRepo.updateStatus(status, name)
  }
}
