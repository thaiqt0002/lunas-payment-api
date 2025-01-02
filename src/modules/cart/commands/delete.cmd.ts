import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'

import { IDeleteCartParams } from '~/cores/interfaces'
import { CartRepo } from '~/cores/repo'

import { DeleteCartDto } from '../cart.dto'

export default class DeleteCartCmd extends DeleteCartDto implements ICommand {
  constructor(options: IDeleteCartParams) {
    super(options)
    Object.assign(this, options)
  }
}
@CommandHandler(DeleteCartCmd)
export class DeleteCartHlr implements ICommandHandler<DeleteCartCmd> {
  constructor(private readonly repo: CartRepo) {}
  async execute(command: DeleteCartCmd): Promise<void> {
    const { userUuid, uuid } = command
    return await this.deleteCart(userUuid, uuid)
  }
  private async deleteCart(userUuid: string, uuid: string): Promise<void> {
    await this.repo.delete({ userUuid, uuid })
  }
}
