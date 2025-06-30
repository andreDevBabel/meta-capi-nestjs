import { Injectable } from '@nestjs/common'
import { SendCapiDto } from './dto/send-capi.dto'
import * as crypto from 'crypto'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// carregar .env aqui pra pegar as variáveis do Pixel e token
dotenv.config()

// SDK oficial do Meta/Facebook
const bizSdk = require('facebook-nodejs-business-sdk')
const { ServerEvent, EventRequest, UserData } = bizSdk

@Injectable()
export class CapiService {
  async sendEvent(data: SendCapiDto) {
    // helper pra hashear (SHA-256) os dados sensíveis pro Meta (exigência deles)
    const hash = (input: string) =>
      crypto.createHash('sha256').update(input.trim().toLowerCase()).digest('hex')

    // monta o objeto do usuário já no padrão da CAPI
    const userData = new UserData()
      .setEmail(hash(data.email))
      .setPhone(data.phone ? hash(data.phone) : undefined)
      .setFirstName(data.first_name ? hash(data.first_name) : undefined)
      .setLastName(data.last_name ? hash(data.last_name) : undefined)
      .setExternalId(data.external_id ? hash(data.external_id) : undefined)

    // aqui é o evento que vai ser disparado pra Meta
    const event = new ServerEvent()
      .setEventName(data.event_name)
      .setEventTime(Math.floor(Date.now() / 1000)) // timestamp em segundos
      .setUserData(userData)
      .setEventSourceUrl(data.event_source_url)
      .setActionSource('website')

    // aqui monta a requisição pra API do Meta com as credenciais do .env
    const request = new EventRequest(
      process.env.META_ACCESS_TOKEN,
      process.env.META_PIXEL_ID,
    ).setEvents([event])

    // dispara e aguarda resposta
    const response = await request.execute()

    // salva log local do que chegou do front e do que voltou da Meta
    this.saveLocalLog({
      timestamp: new Date().toISOString(),
      raw_data: data, // o que chegou do front, sem hash
      event_name: data.event_name,
      response_status: response?.events_received ? 'OK' : 'Erro',
      meta_response: response
    })

    return response // resposta da Meta pro front
  }

  // salva logs em ./logs/capi-events.json só pra debug local e validação de fluxo
  private saveLocalLog(entry: any) {
    const filePath = path.join(__dirname, '../../logs/capi-events.json')
    const logs = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
      : []

    logs.push(entry)
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2))
  }
}
