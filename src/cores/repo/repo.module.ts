import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import * as entities from '~/cores/entities'

import AdditionalFeeRepo from './additional-fee.repo'
import BillRepo from './bill.repo'
import BillDetailRepo from './bill-detail.repo'
import BillStatusRepo from './bill-status.repo'
import CartRepo from './cart.repo'
import PaymentMethodRepo from './payment-method.repo'
import PayosRepo from './payos.repo'
import ServiceFeeRepo from './service-fee.repo'
import StatusRepo from './status.repo'
import TransactionInfoRepo from './transaction-info.repo'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  providers: [
    CartRepo,
    StatusRepo,
    BillRepo,
    AdditionalFeeRepo,
    BillStatusRepo,
    BillDetailRepo,
    ServiceFeeRepo,
    PaymentMethodRepo,
    PayosRepo,
    TransactionInfoRepo,
  ],
  exports: [
    CartRepo,
    StatusRepo,
    BillRepo,
    AdditionalFeeRepo,
    BillStatusRepo,
    BillDetailRepo,
    ServiceFeeRepo,
    PaymentMethodRepo,
    PayosRepo,
    TransactionInfoRepo,
  ],
})
export default class ReposModule {}
