import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator'

// DTO pra garantir que o front sempre mande os campos certos
export class SendCapiDto {
  @IsNotEmpty()
  @IsString()
  event_name: string // Nome do evento (Lead, Purchase, etc)

  @IsNotEmpty()
  @IsString()
  event_source_url: string // URL da página do evento

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  first_name?: string

  @IsOptional()
  @IsString()
  last_name?: string

  @IsOptional()
  @IsString()
  external_id?: string // algum identificador único
}
