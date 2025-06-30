import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Valida o DTO e já bloqueia campos indesejados
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  await app.listen(3000)
}
bootstrap()
