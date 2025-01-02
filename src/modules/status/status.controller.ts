import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { EStatusType } from '~/cores/constants/enum'

import StatusService from './status.service'

@Controller()
export default class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @EventPattern('payment.bills.status.get')
  getBillStatus() {
    return this.statusService.getStatusList()
  }

  @EventPattern('payment.bills.status.update')
  updateBillStatus(@Payload() data: { status: EStatusType; name: string }) {
    return this.statusService.updateStatus(data.status, data.name)
  }
}
