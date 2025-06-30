# Microserviço Meta CAPI (Conversions API) - NestJS

Microserviço leve pra enviar eventos de conversão (Lead, Purchase, CompleteRegistration, etc) pra Meta (Facebook/Instagram) usando a **Conversions API** oficial.  
Ideal pra não depender só de pixel e garantir rastreamento confiável, mesmo com bloqueador de cookies, AdBlock ou fluxo SPA.

## O que faz

- Recebe eventos do front (ex: Angular, React, qualquer coisa)
- Faz hash dos dados sensíveis (SHA-256) como a Meta exige
- Envia pra Meta via SDK oficial Node.js
- Loga tudo local em `logs/capi-events.json` pra debug fácil

---
