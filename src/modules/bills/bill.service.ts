/* eslint-disable max-lines */
/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable no-magic-numbers */
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import * as bcrypt from 'bcrypt'
import { In } from 'typeorm'
import { DeepPartial } from 'typeorm/common/DeepPartial'

import { ERRORS } from '~/cores/constants'
import { BillDetailEntity, BillEntity, BillStatusEntity } from '~/cores/entities'
import { HelperServ } from '~/cores/modules/helper'
import {
  AdditionalFeeRepo,
  BillDetailRepo,
  BillRepo,
  BillStatusRepo,
  CartRepo,
  PayosRepo,
  TransactionInfoRepo,
} from '~/cores/repo'

import { ICmsCreateUserBillPayload, ICreateUserBillPayload, IUpdatePublicBill } from './interfaces'
import PayOsService from '../payos/payos.service'

@Injectable()
export default class BillService {
  private saltOrRounds: number = 10
  constructor(
    private readonly billRepo: BillRepo,
    private readonly billDetailRepo: BillDetailRepo,
    private readonly billStatusRepo: BillStatusRepo,
    private readonly additionalFeeRepo: AdditionalFeeRepo,
    private readonly cartRepo: CartRepo,
    private readonly payOSRepo: PayosRepo,
    private readonly transactionRepo: TransactionInfoRepo,
    private readonly helperService: HelperServ,
    private readonly payOsService: PayOsService,
  ) {}

  getBillsList(page: number, limit: number) {
    return this.billRepo.findAll({
      select: {
        uuid: true,
        userUuid: true,
        orderCode: true,
        customerEmail: true,
        customerFullname: true,
        customerPhoneNumber: true,
        customerDistrict: true,
        customerProvince: true,
        customerWard: true,
        amountTotal: true,
        amountPaid: true,
        note: true,
        status: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        estimatedDeliveryDate: true,
      },
      relations: {},
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
    })
  }

  getBillByBillUuidCMS(billUuid: string) {
    return this.billRepo.findOne({
      select: {
        uuid: true,
        orderCode: true,
        customerEmail: true,
        customerProvince: true,
        customerDistrict: true,
        customerWard: true,
        customerStreet: true,
        customerFullname: true,
        customerPhoneNumber: true,
        note: true,
        status: true,
        amountTotal: true,
        amountPaid: true,
        isPublic: true,
        publicKey: true,
        createdAt: true,
        estimatedDeliveryDate: true,
        paymentLink: {
          id: true,
          type: true,
          amount: true,
          amountPaid: true,
          amountRemaining: true,
          status: true,
          checkoutUrl: true,
          qrCode: true,
        },
        transactions: {
          uuid: true,
          paymentLinkId: true,
          amount: true,
          description: true,
          accountNumber: true,
          transactionDateTime: true,
          counterAccountBankId: true,
          counterAccountBankName: true,
          counterAccountName: true,
          counterAccountNumber: true,
          virtualAccountName: true,
          virtualAccountNumber: true,
        },
        serviceFee: {
          id: true,
          type: true,
          name: true,
          description: true,
          fee: true,
        },
        paymentMethod: {
          id: true,
          name: true,
          type: true,
        },
        billDetails: {
          variantUuid: true,
          quantity: true,
          price: true,
          metadata: {
            productName: true,
            variantName: true,
            variantImage: true,
          },
        },
        statuses: {
          id: true,
          type: true,
          name: true,
          createdAt: true,
        },
      },
      where: {
        uuid: billUuid,
      },
      relations: {
        serviceFee: true,
        paymentMethod: true,
        billDetails: true,
        statuses: true,
        additionFees: true,
        paymentLink: true,
        transactions: true,
      },
    })
  }

  async getBillByBillOrderCode(orderCode: number, userUuid: string, publicKey?: string) {
    const data = await this.billRepo.findOne({
      select: {
        uuid: true,
        orderCode: true,
        customerEmail: true,
        customerProvince: true,
        customerDistrict: true,
        customerWard: true,
        customerStreet: true,
        customerFullname: true,
        customerPhoneNumber: true,
        note: true,
        status: true,
        amountTotal: true,
        amountPaid: true,
        createdAt: true,
        estimatedDeliveryDate: true,
        paymentLink: {
          id: true,
          type: true,
          amount: true,
          amountPaid: true,
          amountRemaining: true,
          status: true,
          checkoutUrl: true,
          qrCode: true,
        },
        serviceFee: {
          id: true,
          type: true,
          name: true,
          description: true,
          fee: true,
        },
        paymentMethod: {
          id: true,
          name: true,
          type: true,
        },
        billDetails: {
          variantUuid: true,
          quantity: true,
          price: true,
          metadata: {
            productName: true,
            variantName: true,
            variantImage: true,
          },
        },
        additionFees: {
          id: true,
          value: true,
          description: true,
          isPaid: true,
        },
        billStatuses: {
          statusId: true,
          status: {
            type: true,
            name: true,
          },
          createdAt: true,
        },
      },
      where: {
        orderCode,
        ...(publicKey ? { publicKey } : { userUuid }),
      },
      relations: {
        serviceFee: true,
        paymentMethod: true,
        billStatuses: {
          status: true,
        },
        billDetails: true,
        additionFees: true,
        paymentLink: true,
      },
    })
    return data || 'C404_BILL_NOT_FOUND'
  }

  async createBill(data: ICreateUserBillPayload) {
    const orderCode = Date.now()
    const billUuid = this.helperService.generateUUID()
    const billData: DeepPartial<BillEntity> = {
      uuid: billUuid,
      userUuid: data.userUuid,
      orderCode,
      serviceFeeId: data.serviceFeeId,
      paymentMethodId: data.paymentMethodId,
      customerEmail: data.customerEmail,
      customerProvince: data.customerProvince,
      customerDistrict: data.customerDistrict,
      customerWard: data.customerWard,
      customerStreet: data.customerStreet,
      customerFullname: data.customerFullname,
      customerPhoneNumber: data.customerPhoneNumber,
      note: data.note,
      status: 'APPROVED',
      amountTotal: data.amountTotal,
      amountPaid: data.amountPaid,
      isPublic: 0,
      publicKey: null,
    }

    const billDetails = data.items.map(({ variantUuid, quantity, price, metadata }) => ({
      billUuid,
      variantUuid,
      quantity,
      price,
      metadata,
    }))

    const billStatus = {
      billUuid,
      statusId: 1,
    }

    const newBill = this.billRepo.create(billData)
    const newBillDetails = this.billDetailRepo.createMany(billDetails)
    const newBillStatus = this.billStatusRepo.create(billStatus)

    await this.billRepo.save(newBill)
    await this.billDetailRepo.saveMany(newBillDetails)
    await this.billStatusRepo.save(newBillStatus)

    const responseData = await this.payOsService.createPaymentLink({
      orderCode,
      amount: data.amountPaid,
      description: `${data.amountTotal} VND`,
      items: data.items.map((item) => ({
        name: `${item.metadata.productName} - ${item.metadata.variantName}`,
        quantity: item.quantity,
        price: item.price,
      })),
      buyerName: data.customerFullname,
      buyerEmail: data.customerEmail,
      buyerPhone: data.customerPhoneNumber,
      buyerAddress: `${data.customerStreet}, ${data.customerWard}, ${data.customerDistrict}, ${data.customerProvince}`,
    })

    const newPayOs = this.payOSRepo.create({
      id: responseData.paymentLinkId,
      orderCode: responseData.orderCode,
      type: 'BILL',
      amount: responseData.amount,
      status: responseData.status,
      checkoutUrl: responseData.checkoutUrl,
      qrCode: responseData.qrCode,
    })
    await this.payOSRepo.save(newPayOs)

    await this.cartRepo.deleteByUserUuidAndVariantUuid(
      data.userUuid,
      data.items.map((item) => item.variantUuid),
    )

    return {
      billUuid,
      checkoutUrl: responseData.checkoutUrl,
      qrCode: responseData.qrCode,
    }
  }

  public async updateBillStatusByUuid(billUuid: string, statuses: number[]) {
    const oldBillStatus = await this.billStatusRepo.findAll({
      where: {
        billUuid,
        statusId: In(statuses),
      },
    })
    const newStatus = statuses.filter((status) => !oldBillStatus.map(({ statusId }) => statusId).includes(status))
    const newBillStatus: DeepPartial<BillStatusEntity>[] = newStatus.map((statusId) => ({ billUuid, statusId }))
    await this.billStatusRepo.saveMany(newBillStatus)
    return 'C200_UPDATE_BILL_STATUS_SUCCESS'
  }

  public async deleteBillByUuid(billUuid: string) {
    const bill = await this.billRepo.findOne({
      select: { uuid: true, orderCode: true },
      where: { uuid: billUuid },
    })

    if (!bill) {
      return 'C404_BILL_NOT_FOUND'
    }
    const { orderCode } = bill

    await this.transactionRepo.delete({ orderCode })
    await this.payOSRepo.delete({ orderCode })
    await this.billDetailRepo.delete({ billUuid })
    await this.billStatusRepo.delete({ billUuid })
    await this.billRepo.delete({ uuid: billUuid })
    return 'C200_DELETE_BILL_SUCCESS'
  }

  public async createAdditionalFeePaymentLinkUser(
    billUuid: string,
    userUuid: string,
    additionalFeeIds: number[],
    publicKey: string,
  ) {
    const bill = await this.billRepo.findOne({
      select: {
        uuid: true,
        orderCode: true,
        customerFullname: true,
        customerEmail: true,
        customerPhoneNumber: true,
        customerProvince: true,
        customerDistrict: true,
        customerWard: true,
      },
      where: {
        uuid: billUuid,
        ...(publicKey ? { publicKey } : { userUuid }),
      },
    })

    if (!bill) {
      throw new RpcException(ERRORS.BILLING_NOT_FOUND)
    }
    const {
      orderCode,
      customerFullname,
      customerEmail,
      customerPhoneNumber,
      customerProvince,
      customerDistrict,
      customerWard,
      customerStreet,
    } = bill

    const additionalFees = await this.additionalFeeRepo.findAll({
      where: {
        id: In(additionalFeeIds),
        isPaid: 0,
      },
    })

    if (additionalFees.length === 0) {
      throw new RpcException(ERRORS.ADDITIONAL_FEE_NOT_FOUND)
    }

    const totalAmount = additionalFees.reduce((accumulator, { value }) => accumulator + value, 0)

    const responseData = await this.payOsService.createPaymentLink({
      orderCode: Date.now(),
      amount: totalAmount,
      description: `${totalAmount} VND`,
      buyerName: customerFullname,
      buyerEmail: customerEmail,
      buyerPhone: customerPhoneNumber,
      buyerAddress: `${customerStreet}, ${customerWard}, ${customerDistrict}, ${customerProvince}`,
    })

    const newPayOs = this.payOSRepo.create({
      id: responseData.paymentLinkId,
      orderCode,
      type: 'ADDITIONAL_FEE',
      amount: responseData.amount,
      status: responseData.status,
      checkoutUrl: responseData.checkoutUrl,
      qrCode: responseData.qrCode,
    })

    await this.payOSRepo.save(newPayOs)

    await this.additionalFeeRepo.updateManyIsPaid(
      billUuid,
      additionalFeeIds.map((id) => id),
      orderCode,
    )

    return {
      checkoutUrl: responseData.checkoutUrl,
      qrCode: responseData.qrCode,
    }
  }

  public getBillsListByUserUuid(userUuid: string) {
    return this.billRepo.findAll({
      select: {
        uuid: true,
        orderCode: true,
        billDetails: {
          variantUuid: true,
          quantity: true,
          price: true,
          metadata: {
            productName: true,
            variantName: true,
            variantImage: true,
          },
        },
        billStatuses: {
          statusId: true,
          status: {
            type: true,
            name: true,
          },
          createdAt: true,
        },
        serviceFee: {
          id: true,
          type: true,
          name: true,
          description: true,
          fee: true,
        },
        additionFees: {
          id: true,
          value: true,
          description: true,
          isPaid: true,
        },
        amountTotal: true,
        createdAt: true,
        estimatedDeliveryDate: true,
      },
      where: { userUuid },
      relations: {
        billDetails: true,
        additionFees: true,
        serviceFee: true,
        billStatuses: {
          status: true,
        },
      },
      order: {
        createdAt: 'DESC',
        statuses: {
          id: 'ASC',
        },
      },
    })
  }

  public async deleteBillStatusByUuid(billUuid: string, statusId: number) {
    const billStatus = await this.billStatusRepo.findOne({
      where: {
        billUuid,
        statusId,
      },
    })

    if (!billStatus) {
      throw new RpcException(ERRORS.BILL_STATUS_NOT_FOUND)
    }

    await this.billStatusRepo.delete({ billUuid, statusId })
    return 'C200_DELETE_BILL_STATUS_SUCCESS'
  }

  public async updateEstimatedDeliveryDateByUuid(billUuid: string, estimatedDeliveryDate: Date) {
    await this.billRepo.updateEstimatedDeliveryDateByUuid(billUuid, estimatedDeliveryDate)
    return 'C200_UPDATE_ESTIMATED_DELIVERY_DATE_SUCCESS'
  }

  public async createBillByCms({ items, ...data }: ICmsCreateUserBillPayload) {
    const orderCode = Date.now()
    const billUuid = this.helperService.generateUUID()
    const publicKey = await bcrypt.hash(billUuid, this.saltOrRounds)

    const billData: DeepPartial<BillEntity> = {
      uuid: billUuid,
      userUuid: null,
      orderCode,
      paymentMethodId: data.paymentMethodId,
      note: null,
      status: 'CREATED',
      amountTotal: 0,
      amountPaid: 0,
      isPublic: 1,
      publicKey,
    }
    const billDetails: DeepPartial<BillDetailEntity>[] = items.map((item) => ({
      billUuid,
      variantUuid: item.variantUuid,
      quantity: item.quantity,
      price: item.price,
      metadata: item.metadata,
    }))
    const billStatus: DeepPartial<BillStatusEntity> = {
      billUuid,
      statusId: 1,
    }

    const newBill = this.billRepo.create(billData)
    const newBillDetails = this.billDetailRepo.createMany(billDetails)
    const newBillStatus = this.billStatusRepo.create(billStatus)

    await this.billRepo.save(newBill)
    await this.billDetailRepo.saveMany(newBillDetails)
    await this.billStatusRepo.save(newBillStatus)
    return 'C200_CREATE_BILL_SUCCESS'
  }

  public async updatePublicBillByUser(orderCode: number, data: Omit<IUpdatePublicBill, 'orderCode'>) {
    const bill = await this.billRepo.findOne({
      where: {
        orderCode,
        userUuid: null,
        isPublic: 1,
      },
    })
    const isMatch = await bcrypt.compare(bill.uuid, data.publicKey)
    if (!bill) {
      throw new RpcException(ERRORS.BILLING_NOT_FOUND)
    }
    if (!isMatch) {
      throw new RpcException(ERRORS.BILL_PUBLISH_KEY_NOT_MATCH)
    }

    const billData: DeepPartial<BillEntity> = {
      serviceFeeId: data.serviceFeeId,
      customerEmail: data.customerEmail,
      customerProvince: data.customerProvince,
      customerDistrict: data.customerDistrict,
      customerWard: data.customerWard,
      customerStreet: data.customerStreet,
      customerPhoneNumber: data.customerPhoneNumber,
      customerFullname: data.customerFullname,
      note: data.note,
      status: 'APPROVED',
      amountTotal: data.amountTotal,
      amountPaid: data.amountPaid,
    }

    await this.billRepo.updateBillByUuid(bill.uuid, billData)
    const responseData = await this.payOsService.createPaymentLink({
      orderCode,
      amount: data.amountPaid,
      description: `${data.amountTotal} VND`,
      buyerName: data.customerFullname,
      buyerEmail: data.customerEmail,
      buyerPhone: data.customerPhoneNumber,
      buyerAddress: `${data.customerStreet}, ${data.customerWard}, ${data.customerDistrict}, ${data.customerProvince}`,
    })

    const newPayOs = this.payOSRepo.create({
      id: responseData.paymentLinkId,
      orderCode: responseData.orderCode,
      type: 'BILL',
      amount: responseData.amount,
      status: responseData.status,
      checkoutUrl: responseData.checkoutUrl,
      qrCode: responseData.qrCode,
    })
    await this.payOSRepo.save(newPayOs)
    return {
      billUuid: bill.uuid,
      checkoutUrl: responseData.checkoutUrl,
      qrCode: responseData.qrCode,
    }
  }

  public async getPublicBillByOrderCode(orderCode: number, publicKey: string) {
    const paymentLink = await this.payOSRepo.findOne({
      where: {
        orderCode,
        type: 'BILL',
      },
    })

    if (paymentLink) {
      throw new RpcException(ERRORS.BILL_HAS_BEEN_PAYMENT_LINK)
    }
    const bill = await this.billRepo.findOne({
      where: {
        orderCode,
        userUuid: null,
        isPublic: 1,
      },
    })

    if (!bill) {
      throw new RpcException(ERRORS.BILLING_NOT_FOUND)
    }

    const isMatch = await bcrypt.compare(bill.uuid, publicKey)
    if (!isMatch) {
      throw new RpcException(ERRORS.BILL_PUBLISH_KEY_NOT_MATCH)
    }

    return this.billRepo.findOne({
      select: {
        uuid: true,
        orderCode: true,
        createdAt: true,
        status: true,
        estimatedDeliveryDate: true,
        paymentLink: {
          id: true,
          type: true,
          amount: true,
          amountPaid: true,
          amountRemaining: true,
          status: true,
          checkoutUrl: true,
          qrCode: true,
        },
        serviceFee: {
          id: true,
          type: true,
          name: true,
          description: true,
          fee: true,
        },
        paymentMethod: {
          id: true,
          name: true,
          type: true,
        },
        billDetails: {
          variantUuid: true,
          quantity: true,
          price: true,
          metadata: {
            productName: true,
            variantName: true,
            variantImage: true,
          },
        },
        statuses: {
          id: true,
          type: true,
          name: true,
          createdAt: true,
        },
      },
      where: {
        orderCode,
        userUuid: null,
        isPublic: 1,
      },
      relations: {
        serviceFee: true,
        paymentMethod: true,
        billDetails: true,
        statuses: true,
        additionFees: true,
        paymentLink: true,
      },
    })
  }
}
