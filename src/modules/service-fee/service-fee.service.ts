import { Injectable } from '@nestjs/common'

import { ServiceFeeRepo } from '~/cores/repo'

@Injectable()
export default class ServiceFeeService {
  constructor(private readonly serviceFeeRepo: ServiceFeeRepo) {}

  getServiceFeeList() {
    return this.serviceFeeRepo.findAll({
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        fee: true,
      },
    })
  }

  updateServiceFee(data: { id: number; fee?: number; name?: string; description?: string }) {
    return this.serviceFeeRepo.update(data)
  }
}
