import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { IBaseTransactionInfo } from '~/cores/interfaces'

import AdditionalFeeService from './additionalFee.service'
import BillService from './bill.service'
import {
  ICmsCreateUserBillPayload,
  ICreateAdditionalFee,
  ICreateUserBillPayload,
  IDeleteAdditionalFee,
  IUpdateAdditionalFee,
  IUpdatePublicBill,
} from './interfaces'
import TransactionService from './transaction.service'
import PayOsService from '../payos/payos.service'

@Controller('')
export default class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly payOsService: PayOsService,
    private readonly transactionService: TransactionService,
    private readonly additionalFeeService: AdditionalFeeService,
  ) {}

  @MessagePattern('payment.webhook.confirm')
  confirmWebhook(@Payload() data: { webhookUrl: string }) {
    return this.payOsService.confirmWebhook(data.webhookUrl)
  }

  @MessagePattern('payment.webhook.transaction.create')
  createWebhook(@Payload() data: Omit<IBaseTransactionInfo, 'uuid'> & { reference: string }) {
    return this.payOsService.createTransaction(data)
  }

  @MessagePattern('payment.bills.cms.list')
  getBills(@Payload() data: { page: number; limit: number }) {
    return this.billService.getBillsList(data.page, data.limit)
  }

  @MessagePattern('payment.bills.cms.create')
  createBillCMS(@Payload() data: ICmsCreateUserBillPayload) {
    return this.billService.createBillByCms(data)
  }

  @MessagePattern('payment.bills.cms.get')
  getBillDetailCMS(@Payload() data: { billUuid: string }) {
    return this.billService.getBillByBillUuidCMS(data.billUuid)
  }

  @MessagePattern('payment.bills.cms.billUuid.estimated-delivery-date.update')
  updateEstimatedDeliveryDate(
    @Payload() { billUuid, estimatedDeliveryDate }: { billUuid: string; estimatedDeliveryDate: Date },
  ) {
    return this.billService.updateEstimatedDeliveryDateByUuid(billUuid, estimatedDeliveryDate)
  }

  @MessagePattern('payment.bills.cms.billUuid.statuses.update')
  updateBillStatus(@Payload() { billUuid, statuses }: { billUuid: string; statuses: number[] }) {
    return this.billService.updateBillStatusByUuid(billUuid, statuses)
  }

  @MessagePattern('payment.bills.cms.billUuid.statuses.delete')
  deleteBillStatus(@Payload() { billUuid, statusId }: { billUuid: string; statusId: number }) {
    return this.billService.deleteBillStatusByUuid(billUuid, statusId)
  }

  @MessagePattern('payment.bills.cms.billUuid.additional-fees.create')
  createAdditionalFee(@Payload() data: ICreateAdditionalFee) {
    return this.additionalFeeService.createAdditionalFee(data.billUuid, data.additionalFee)
  }

  @MessagePattern('payment.bills.cms.billUuid.additional-fees.update')
  updateAdditionalFee(@Payload() data: IUpdateAdditionalFee) {
    return this.additionalFeeService.updateAdditionalFee(data.billUuid, data.additionalFee)
  }

  @MessagePattern('payment.bills.cms.billUuid.additional-fees.delete')
  deleteAdditionalFee(@Payload() data: IDeleteAdditionalFee) {
    return this.additionalFeeService.deleteAdditionalFee(data.billUuid, data.additionalFeeId)
  }

  @MessagePattern('payment.bills.cms.billUuid.delete')
  deleteBill(@Payload() data: { billUuid: string }) {
    return this.billService.deleteBillByUuid(data.billUuid)
  }

  @MessagePattern('payment.payments.cms.list')
  getPayments(@Payload() data: { page: number; limit: number }) {
    return this.payOsService.getPayments(data.page, data.limit)
  }

  @MessagePattern('payment.transactions.cms.list')
  getTransaction(@Payload() data: { page: number; limit: number }) {
    return this.transactionService.getTransaction(data.page, data.limit)
  }

  @MessagePattern('payment.bills.users.list')
  getBillsUser(@Payload() data: { userUuid: string }) {
    return this.billService.getBillsListByUserUuid(data.userUuid)
  }

  @MessagePattern('payment.bills.users.get')
  getBillDetail(@Payload() data: { userUuid: string; orderCode: number; publicKey: string }) {
    return this.billService.getBillByBillOrderCode(data.orderCode, data.userUuid, data.publicKey)
  }

  @MessagePattern('payment.bills.users.get_public')
  getPublicBillDetail(@Payload() data: { orderCode: number; publicKey: string }) {
    return this.billService.getPublicBillByOrderCode(data.orderCode, data.publicKey)
  }

  @MessagePattern('payment.bills.users.create')
  createBill(@Payload() data: ICreateUserBillPayload) {
    return this.billService.createBill(data)
  }

  @MessagePattern('payment.bills.users.public.update')
  updatePublicBill(@Payload() { orderCode, ...data }: IUpdatePublicBill) {
    return this.billService.updatePublicBillByUser(orderCode, data)
  }

  @MessagePattern('payment.bills.users.billUuid.additional-fees.create')
  createAdditionalFeePaymentLinkUser(
    @Payload() data: { billUuid: string; userUuid: string; additionalFeeIds: number[]; publicKey: string },
  ) {
    return this.billService.createAdditionalFeePaymentLinkUser(
      data.billUuid,
      data.userUuid,
      data.additionalFeeIds,
      data.publicKey,
    )
  }

  @MessagePattern('payment.bills.users.billUuid.email.create_otp')
  sendEmailOTP(@Payload() data: { billUuid: string; email: string; type: 'CREATE' | 'RESEND' | 'RENEW' }) {
    return `OTP sent to ${data.email}`
  }

  @MessagePattern('payment.bills.users.billUuid.email.confirm_otp')
  confirmEmailOTP(@Payload() data: { billUuid: string; email: string; otp: string }) {
    return `OTP confirmed for ${data.email}`
  }

  @MessagePattern('payment.bills.users.checkout')
  checkoutBill() {
    return true
  }
}
