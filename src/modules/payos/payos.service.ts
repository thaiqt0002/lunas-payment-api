import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import PayOS from '@payos/node'
import { CheckoutRequestType, WebhookType } from '@payos/node/lib/type'

import { TConfig } from '~/cores/configs/interface'
import { ERRORS } from '~/cores/constants'
import { IBaseTransactionInfo } from '~/cores/interfaces'
import { BillRepo, BillStatusRepo, PayosRepo, TransactionInfoRepo } from '~/cores/repo'

@Injectable()
export default class PayOsService {
  private payOS!: PayOS
  constructor(
    private readonly payOSRepo: PayosRepo,
    private readonly billRepo: BillRepo,
    private readonly billStatusRepo: BillStatusRepo,
    private readonly transactionInfoRepo: TransactionInfoRepo,
    private readonly configService: ConfigService<TConfig>,
  ) {
    this.payOS = new PayOS(
      this.configService.get('PAYOS_CLIENT_ID'),
      this.configService.get('PAYOS_API_KEY'),
      this.configService.get('PAYOS_CHECKSUM'),
    )
  }

  createPaymentLink(data: Omit<CheckoutRequestType, 'cancelUrl' | 'returnUrl'>) {
    return this.payOS.createPaymentLink({
      ...data,
      cancelUrl: this.configService.get('PAYOS_CANCEL_URL'),
      returnUrl: this.configService.get('PAYOS_RETURN_URL'),
    })
  }

  getPaymentLinkInfo(id: string) {
    return this.payOS.getPaymentLinkInformation(id)
  }

  cancelPaymentLink(id: string, reason?: string) {
    return this.payOS.cancelPaymentLink(id, reason)
  }

  confirmWebhook(url: string) {
    return this.payOS.confirmWebhook(url)
  }

  verifyPaymentWebhook(data: WebhookType) {
    return this.payOS.verifyPaymentWebhookData(data)
  }

  async createTransaction(data: Omit<IBaseTransactionInfo, 'uuid'> & { reference: string }) {
    const isExistPayOs = await this.payOSRepo.findOne({
      select: {
        id: true,
        type: true,
        orderCode: true,
      },
      where: { id: data.paymentLinkId },
    })
    if (!isExistPayOs) {
      throw new RpcException(ERRORS.PAYOS_NOT_FOUND)
    }
    const newTransaction = this.transactionInfoRepo.create({
      uuid: data.reference,
      orderCode: isExistPayOs.orderCode,
      paymentLinkId: data.paymentLinkId,
      amount: data.amount,
      description: data.description,
      accountNumber: data.accountNumber,
      transactionDateTime: data.transactionDateTime,
      currency: data.currency,
      code: data.code,
      desc: data.desc,
      counterAccountBankId: data.counterAccountBankId,
      counterAccountBankName: data.counterAccountBankName,
      counterAccountName: data.counterAccountName,
      counterAccountNumber: data.counterAccountNumber,
      virtualAccountName: data.virtualAccountName,
      virtualAccountNumber: data.virtualAccountNumber,
    })
    await this.transactionInfoRepo.save(newTransaction)

    // Update status of payment link
    const paymentInfo = await this.getPaymentLinkInfo(data.paymentLinkId)
    await this.payOSRepo.updateByUuid(
      {
        status: paymentInfo.status,
        amountPaid: paymentInfo.amountPaid,
        amountRemaining: paymentInfo.amountRemaining,
        canceledAt: paymentInfo.canceledAt as any,
      },
      paymentInfo.id,
    )

    if (isExistPayOs.type === 'BILL' && paymentInfo.amountRemaining <= 0) {
      const billUuid = await this.billRepo.findOne({
        select: { uuid: true },
        where: { orderCode: data.orderCode },
      })
      const newStatus = this.billStatusRepo.create({
        billUuid: billUuid.uuid,
        statusId: 3,
      })
      await this.billStatusRepo.save(newStatus)
    }
    return true
  }

  getPayments(page: number, limit: number) {
    return this.payOSRepo.findAll({
      select: {
        id: true,
        orderCode: true,
        type: true,
        amount: true,
        amountPaid: true,
        amountRemaining: true,
        status: true,
        checkoutUrl: true,
        createdAt: true,
        canceledAt: true,
        transactions: {
          uuid: true,
          amount: true,
          accountNumber: true,
          description: true,
          transactionDateTime: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        transactions: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    })
  }
}
