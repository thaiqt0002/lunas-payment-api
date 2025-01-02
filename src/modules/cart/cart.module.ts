import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TConfig } from '~/cores/configs/interface'
import CartEntity from '~/cores/entities/cart.entity'

import CartController from './cart.controller'
import { CreateCartHlr, DeleteCartHlr, UpdateCartHlr } from './commands'
import { GetUserCartsHldr } from './queries/get-user.qr'

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity])],
  providers: [
    CreateCartHlr,
    DeleteCartHlr,
    UpdateCartHlr,
    GetUserCartsHldr,
    {
      provide: 'ECOMMERCE_SERVICE',
      useFactory: (configService: ConfigService<TConfig>) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('ECOMMERCE_SERVICE_HOST'),
            port: configService.get('ECOMMERCE_SERVICE_PORT'),
          },
        })
      },
      inject: [ConfigService],
    },
  ],
  controllers: [CartController],
})
export default class CartModule {}
