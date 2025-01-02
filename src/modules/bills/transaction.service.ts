import { Injectable } from '@nestjs/common'

import { TransactionInfoRepo } from '~/cores/repo'

@Injectable()
export default class TransactionService {
  constructor(private readonly transactionRepo: TransactionInfoRepo) {}

  getTransaction(page: number, limit: number) {
    return this.transactionRepo.findAll({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        transactionDateTime: 'DESC',
      },
    })
  }
}
