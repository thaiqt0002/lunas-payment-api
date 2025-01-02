import { Inject } from '@nestjs/common'
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'

import { PIPE_TIMEOUT } from '~/cores/constants'
import { CartRepo } from '~/cores/repo'

export default class GetUserCartsQr implements IQuery {
  public readonly userUuid: string
  constructor(userUuid: string) {
    this.userUuid = userUuid
  }
}

@QueryHandler(GetUserCartsQr)
export class GetUserCartsHldr implements IQueryHandler<GetUserCartsQr> {
  constructor(
    private readonly repo: CartRepo,
    @Inject('ECOMMERCE_SERVICE') private readonly ecommerceClient: ClientProxy,
  ) {}
  async execute({ userUuid }: GetUserCartsQr) {
    const carts = await this.getUserCart(userUuid)
    if (carts.length === 0) {
      return []
    }
    const product = this.ecommerceClient.send('product.get_by_variant', carts).pipe(timeout(PIPE_TIMEOUT))
    return await lastValueFrom(product)
  }
  private async getUserCart(userUuid: string) {
    const carts = await this.repo.findAll({ where: { userUuid }, order: { createdAt: 'desc' } })
    return carts.map((cart) => {
      return {
        variantUuid: cart.variantUuid,
        quantity: cart.quantity,
        cartUuid: cart.uuid,
        cartCreatedAt: cart.createdAt,
      }
    })
  }
}
