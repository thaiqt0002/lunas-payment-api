import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   snapshot: true,
  //   bufferLogs: true,
  // })

  // const configSerivce = app.get<ConfigService>(ConfigService)
  // const port = configSerivce.get<number>('PORT') ?? DEFAULT_PORT
  // const appEnv = configSerivce.get<string>('APP_ENV')

  // app.setGlobalPrefix(PATH.GLOBAL_PREFIX)
  // app.use(cookieParser())
  // app.use(compression())
  // app.enableCors(CORS)
  // app.enableShutdownHooks()
  // if (appEnv !== 'prod') {
  //   const config = new DocumentBuild(app)
  //   config.build()
  // }
  // await app.listen(port)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 9300,
    },
  })
  app.listen()
}

// eslint-disable-next-line
bootstrap()
