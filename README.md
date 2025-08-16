# SHIRA Command Center – Integrated
Sala di comando H24 con webhook sicuri, status live e alert email.

## Setup rapido
```bash
cp .env.example .env
npm i
npm run dev
```

## Webhook (firma HMAC)
Header: `x-shira-signature` = HMAC-SHA256(rawBody, SHIRA_WEBHOOK_SECRET)

### POST /api/hooks/heartbeat
```
{ "module":"FOOT","verified":true,"freshnessSec":120,"timeDriftMs":-3,"ts":"2025-08-10T10:15:00Z" }
```

### POST /api/hooks/generation
```
{ "id":"FOOT-1015-A","module":"FOOT","type":"COMBO","stake":2,"totalOdds":8.2,"potentialWin":16.4,"confidence":0.85,"ev":1.18,"mode":"VERIFIED","items":[{ "event":"TeamA-TeamB","market":"1X2","pick":"1","odds":1.95,"confidence":0.85,"ev":1.05 }],"ts":"2025-08-10T10:16:00Z" }
```

### POST /api/hooks/validator
```
{ "module":"FOOT","runId":"20250810_2355","results":[{ "ticketId":"FOOT-1015-A","hit":true,"payout":16.4,"delta":14.4 }],"ts":"2025-08-10T23:55:00Z" }
```

## Status & Generate
- `GET /api/status` → aggrega ultimi heartbeat per modulo
- `GET /api/generate?kind=FOOT.Combo` → inoltra richiesta al tuo motore (se configurato)

## Alert email
`POST /api/alert` con `{ "subject":"...", "text":"..." }`
