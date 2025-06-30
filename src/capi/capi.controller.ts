import { Controller, Post, Body } from '@nestjs/common'
import { CapiService } from './capi.service'
import { SendCapiDto } from './dto/send-capi.dto'

// Endpoint pra receber os eventos do front (Angular, etc)
@Controller('capi')
export class CapiController {
  constructor(private readonly capiService: CapiService) {}

  @Post('event')
  async sendCapi(@Body() body: SendCapiDto) {
    // Só dispara pro service, o resto é descartado
    return this.capiService.sendEvent(body)
  }
}
