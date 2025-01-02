import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import Configurations from '~/cores/configs'
import * as entities from '~/cores/entities'
import CoreModule from '~/cores/modules/core.module'

import AllTcpExceptionsFilter from './cores/filters/all-tcp.exception.filter'
import ReposModule from './cores/repo/repo.module'
import BillModule from './modules/bills/bill.module'
import CartModule from './modules/cart/cart.module'
import PayOsModule from './modules/payos/payos.module'
import ServiceFeeModule from './modules/service-fee/service-fee.module'
import StatusModule from './modules/status/status.module'

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env.payment',
      isGlobal: true,
      load: [Configurations],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configServ: ConfigService) => ({
        type: 'mysql',
        host: configServ.get<string>('DB.HOST'),
        port: configServ.get<number>('DB.PORT'),
        username: configServ.get<string>('DB.USER'),
        password: configServ.get<string>('DB.PASSWORD'),
        database: configServ.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        entities: Object.values(entities),
      }),
      inject: [ConfigService],
    }),
    CoreModule,
    ReposModule,
    PayOsModule,
    BillModule,
    CartModule,
    ServiceFeeModule,
    StatusModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllTcpExceptionsFilter,
    },
  ],
})
export class AppModule {}
