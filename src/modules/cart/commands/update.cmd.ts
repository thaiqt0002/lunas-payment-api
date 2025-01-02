import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'

import { IUpdateCartParams } from '~/cores/interfaces'
import { CartRepo } from '~/cores/repo'

import { UpdateCartDto } from '../cart.dto'

export default class UpdateCartCmd extends UpdateCartDto implements ICommand {
  constructor(options: IUpdateCartParams) {
    super(options)
    Object.assign(this, options)
  }
}
@CommandHandler(UpdateCartCmd)
export class UpdateCartHlr implements ICommandHandler<UpdateCartCmd> {
  constructor(private readonly repo: CartRepo) {}
  async execute(command: UpdateCartCmd): Promise<void> {
    const { userUuid, uuid, quantity } = command
    return await this.updateQuantity(userUuid, uuid, quantity)
  }

  private async updateQuantity(userUuid: string, uuid: string, quantity: number): Promise<void> {
    const cart = await this.repo.findOne({ where: { userUuid, uuid } })
    if (cart) {
      cart.quantity = quantity
      await this.repo.save(cart)
    }
  }
}
