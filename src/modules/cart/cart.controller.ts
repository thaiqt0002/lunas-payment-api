import { Controller } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { EventPattern, Payload } from '@nestjs/microservices'

import { ICreateCartParams, IDeleteCartParams, IUpdateCartParams } from '~/cores/interfaces'

import { CreateCartCmd, DeleteCartCmd, UpdateCartCmd } from './commands'
import GetUserCartsQr from './queries/get-user.qr'

@Controller()
export default class CartController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @EventPattern('payment.cart.create')
  async create(@Payload() data: ICreateCartParams): Promise<void> {
    await this.commandBus.execute(new CreateCartCmd(data))
  }

  @EventPattern('payment.cart.delete')
  async delete(@Payload() data: IDeleteCartParams): Promise<void> {
    await this.commandBus.execute(new DeleteCartCmd(data))
  }

  @EventPattern('payment.cart.update')
  async update(@Payload() data: IUpdateCartParams): Promise<void> {
    await this.commandBus.execute(new UpdateCartCmd(data))
  }

  @EventPattern('payment.cart.get')
  async get(@Payload() data: { userUuid: string }) {
    return await this.queryBus.execute(new GetUserCartsQr(data.userUuid))
  }
}
