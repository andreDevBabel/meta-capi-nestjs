# Microserviço Meta CAPI (Conversions API) - NestJS

Microserviço leve pra enviar eventos de conversão (Lead, Purchase, CompleteRegistration, etc) pra Meta (Facebook/Instagram) usando a **Conversions API** oficial.  
Ideal pra não depender só de pixel e garantir rastreamento confiável, mesmo com bloqueador de cookies, AdBlock ou fluxo SPA.

## O que faz

- Recebe eventos do front (ex: Angular, React, qualquer coisa)
- Faz hash dos dados sensíveis (SHA-256) como a Meta exige
- Envia pra Meta via SDK oficial Node.js
- Loga tudo local em `logs/capi-events.json` pra debug fácil

---
## Exemplo de integração com Angular

Assim que o usuário for cadastrado com sucesso no seu front, basta disparar a requisição para microserviço CAPI.  
O endpoint espera os dados crus (NÃO hasheados). O hash é feito só no backend(o Micro Serviço), do jeito certo.

```ts
// cadastro.component.ts

import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

cadastrarUsuario() {
  // Aqui é o fluxo normal do cadastro, pode ser Firebase, API, etc
  this.authService.createUser(this.form.value).subscribe({
    next: (user) => {
      // Assim que cadastrar, já manda pro microserviço CAPI
      this.http.post('https://microservico.exemplo/capi/event', {
        event_name: 'Lead', // ou CompleteRegistration, Purchase, etc.
        event_source_url: window.location.href, // URL atual da página
        email: user.email,
        phone: this.form.value.phone,
        first_name: this.form.value.firstName,
        last_name: this.form.value.lastName,
        external_id: user.uid || user.id || this.form.value.cpf // identificador único
      }).subscribe({
        next: () => {
          // Só pra log mesmo, pode tirar depois
          console.log('Evento enviado pra Meta CAPI')
        },
        error: (err) => {
          console.error('Erro ao enviar pra CAPI', err)
        }
      })
    },
    error: (err) => {
      console.error('Erro ao cadastrar usuário', err)
    }
  });
}
