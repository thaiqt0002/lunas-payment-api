import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { DeepPartial } from 'typeorm/common/DeepPartial'

import { ERRORS } from '~/cores/constants'
import { AdditionFeeEntity } from '~/cores/entities'
import { AdditionalFeeRepo } from '~/cores/repo'

@Injectable()
export default class AdditionalFeeService {
  constructor(private readonly additionalFeeRepo: AdditionalFeeRepo) {}

  public async createAdditionalFee(
    billUuid: string,
    additionalFee: {
      value: number
      description: string
    },
  ) {
    const data: DeepPartial<AdditionFeeEntity> = this.additionalFeeRepo.create({
      billUuid,
      ...additionalFee,
    })
    await this.additionalFeeRepo.save(data)
    return true
  }

  public async updateAdditionalFee(
    billUuid: string,
    additionalFee: {
      id: number
      value?: number
      description?: string
    },
  ) {
    const data = await this.additionalFeeRepo.findOne({
      where: {
        id: additionalFee.id,
        billUuid,
      },
    })

    if (!data) {
      throw new RpcException(ERRORS.ADDITIONAL_FEE_NOT_FOUND)
    }

    await this.additionalFeeRepo.updateAdditionalFee(billUuid, additionalFee)
    return true
  }

  public async deleteAdditionalFee(billUuid: string, additionalFeeId: number) {
    const data = await this.additionalFeeRepo.findOne({
      where: {
        id: additionalFeeId,
        billUuid,
      },
    })

    if (!data) {
      throw new RpcException(ERRORS.ADDITIONAL_FEE_NOT_FOUND)
    }

    await this.additionalFeeRepo.delete({
      id: additionalFeeId,
      billUuid,
    })
    return true
  }
}
