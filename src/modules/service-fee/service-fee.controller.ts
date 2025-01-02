import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import ServiceFeeService from './service-fee.service'

@Controller()
export default class ServiceFeeController {
  constructor(private readonly serviceFeeService: ServiceFeeService) {}
  @MessagePattern('payment.service-fee.get')
  getServiceFeeList() {
    return this.serviceFeeService.getServiceFeeList()
  }

  @MessagePattern('payment.service-fee.update')
  updateServiceFee(@Payload() data: { id: number; fee?: number; name?: string; description?: string }) {
    return this.serviceFeeService.updateServiceFee(data)
  }
}
