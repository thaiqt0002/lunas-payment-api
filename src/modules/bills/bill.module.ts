import { Module } from '@nestjs/common'

import AdditionalFeeService from './additionalFee.service'
import BillController from './bill.controller'
import BillService from './bill.service'
import TransactionService from './transaction.service'

@Module({
  controllers: [BillController],
  providers: [BillService, TransactionService, AdditionalFeeService],
})
export default class BillModule {}
