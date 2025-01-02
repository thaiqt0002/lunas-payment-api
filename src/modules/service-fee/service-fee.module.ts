import { Module } from '@nestjs/common'

import ServiceFeeController from './service-fee.controller'
import ServiceFeeService from './service-fee.service'

@Module({
  controllers: [ServiceFeeController],
  providers: [ServiceFeeService],
})
export default class ServiceFeeModule {}
