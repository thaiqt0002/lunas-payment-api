import { HttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { TConfig } from '~/cores/configs/interface'

import PayOsService from './payos.service'

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [],
      useFactory: (configService: ConfigService<TConfig>) => ({
        baseURL: configService.get('PAYOS_BASE_URL'),
        headers: {
          'x-client-id': configService.get('PAYOS_CLIENT_ID'),
          'x-api-key': configService.get('PAYOS_API_KEY'),
        },
        timeout: 5000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PayOsService],
  exports: [PayOsService],
})
export default class PayOsModule {}
