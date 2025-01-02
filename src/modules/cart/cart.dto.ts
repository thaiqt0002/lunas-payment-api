import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { IsNumber, IsUUID, Min } from 'class-validator'

import { BaseDateDto, BaseUuidDto } from '~/cores/dtos'
import { IBaseCart } from '~/cores/interfaces/cart.interface'

class BaseCartDto extends IntersectionType(BaseUuidDto, BaseDateDto) implements IBaseCart {
  @ApiProperty({
    description: 'Variant UUID of the product',
    example: '2bb5f8b6-c59f-487c-a8b4-d3ac9bec7916',
  })
  @IsUUID('all', { message: 'Variant UUID must be a UUID' })
  variantUuid!: string

  @ApiProperty({
    description: 'User UUID',
    example: '2bb5f8b6-c59f-487c-a8b4-d3ac9bec7916',
  })
  @IsUUID('all', { message: 'User UUID must be a UUID' })
  userUuid!: string

  @ApiProperty({
    description: 'Quantity of the product',
    example: 1,
  })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity must be greater than or equal to 0' })
  quantity!: number
}

export class CreateCartDto extends PickType(BaseCartDto, ['userUuid', 'quantity', 'variantUuid'] as const) {}
export class DeleteCartDto extends PickType(BaseCartDto, ['userUuid', 'uuid'] as const) {}
export class UpdateCartDto extends PickType(BaseCartDto, ['uuid', 'quantity', 'userUuid'] as const) {}
