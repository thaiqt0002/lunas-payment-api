import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'

import CartEntity from '~/cores/entities/cart.entity'
import { ICreateCartParams } from '~/cores/interfaces'
import { CartRepo } from '~/cores/repo'

import { CreateCartDto } from '../cart.dto'

export default class CreateCartCmd extends CreateCartDto implements ICommand {
  constructor(options: ICreateCartParams) {
    super(options)
    Object.assign(this, options)
  }
}
@CommandHandler(CreateCartCmd)
export class CreateCartHlr implements ICommandHandler<CreateCartCmd> {
  constructor(private readonly repo: CartRepo) {}
  async execute(command: CreateCartCmd): Promise<void> {
    const { userUuid, variantUuid, quantity } = command
    const cart = await this.findCartByUser(userUuid, variantUuid)
    if (!cart) {
      return await this.createCart(command)
    }
    return this.updateCart(cart, quantity)
  }

  private async findCartByUser(userUuid: string, variantUuid: string): Promise<CartEntity | null> {
    return await this.repo.findOne({
      where: {
        userUuid,
        variantUuid,
      },
    })
  }
  private async createCart(cart: CreateCartCmd): Promise<void> {
    const newCart = this.repo.create(cart)
    await this.repo.save(newCart)
  }
  private async updateCart(cart: CartEntity, quantity: number): Promise<void> {
    await this.repo.save({
      ...cart,
      quantity,
    })
  }
}
