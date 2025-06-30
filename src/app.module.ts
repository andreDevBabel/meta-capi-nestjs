import { Module } from '@nestjs/common'
import { CapiController } from './capi/capi.controller'
import { CapiService } from './capi/capi.service'

@Module({
  controllers: [CapiController],
  providers: [CapiService],
})
export class AppModule {}
