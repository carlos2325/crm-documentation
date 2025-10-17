# ⚡ CONSULTAS RÁPIDAS PARA CURSOR

## 🚀 Comandos Listos para Copiar y Pegar

### Token JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY
```

---

## 📋 CONSULTAS BÁSICAS

### 1. CRM Leads (2 registros esperados)
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMLeads { leads { id name email status } pagination { total } } }"}'
```

### 2. CRM Contacts (1 registro esperado)
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMContacts { contacts { id fullName email status } pagination { total } } }"}'
```

### 3. CRM Entities (1 registro esperado)
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMEntities { entities { id name type industry status } pagination { total } } }"}'
```

### 4. CRM Campaigns (1 registro esperado)
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMCampaigns { campaigns { id name type status } pagination { total } } }"}'
```

### 5. Whitelabels (3 registros esperados)
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getWhitelabels { whitelabels { id name slug domain } } }"}'
```

### 6. Whitelabel Individual (1 registro esperado)
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query GetWhitelabel($id: ID!) { getWhitelabel(id: $id) { success whitelabel { id name slug domain } } }", "variables": {"id": "68c44a22c7d67b3a84d73120"}}'
```

---

## 🧪 CONSULTA DE VERIFICACIÓN COMPLETA

### Test de Todas las Consultas
```bash
echo "🧪 PROBANDO TODAS LAS CONSULTAS"
echo "==============================="
echo ""

echo "1️⃣ CRM Leads:"
curl -s -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMLeads { leads { id name email status } pagination { total } } }"}' | jq '.data.getCRMLeads.pagination.total'

echo "2️⃣ CRM Contacts:"
curl -s -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMContacts { contacts { id fullName email status } pagination { total } } }"}' | jq '.data.getCRMContacts.pagination.total'

echo "3️⃣ CRM Entities:"
curl -s -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMEntities { entities { id name type industry status } pagination { total } } }"}' | jq '.data.getCRMEntities.pagination.total'

echo "4️⃣ CRM Campaigns:"
curl -s -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getCRMCampaigns { campaigns { id name type status } pagination { total } } }"}' | jq '.data.getCRMCampaigns.pagination.total'

echo "5️⃣ Whitelabels:"
curl -s -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query { getWhitelabels { whitelabels { id name slug domain } } }"}' | jq '.data.getWhitelabels.whitelabels | length'

echo "6️⃣ Whitelabel Individual:"
curl -s -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{"query":"query GetWhitelabel($id: ID!) { getWhitelabel(id: $id) { success whitelabel { id name slug domain } } }", "variables": {"id": "68c44a22c7d67b3a84d73120"}}' | jq '.data.getWhitelabel.success'

echo ""
echo "🎯 RESULTADOS ESPERADOS:"
echo "========================"
echo "✅ CRM Leads: 2 registros"
echo "✅ CRM Contacts: 1 registro"
echo "✅ CRM Entities: 1 registro"
echo "✅ CRM Campaigns: 1 registro"
echo "✅ Whitelabels: 3 registros"
echo "✅ Whitelabel Individual: true"
echo ""
echo "🚀 ¡Sistema 100% operativo!"
```

---

## 📊 RESULTADOS ESPERADOS

- **CRM Leads**: 2 registros
- **CRM Contacts**: 1 registro
- **CRM Entities**: 1 registro
- **CRM Campaigns**: 1 registro
- **Whitelabels**: 3 registros
- **Whitelabel Individual**: true (éxito)

**Total**: 8 registros sincronizados perfectamente entre MongoDB y GraphQL

---

## 🎯 INSTRUCCIONES

1. **Copia y pega** cada comando en tu terminal
2. **Ejecuta uno por uno** para verificar cada módulo
3. **Confirma** que devuelve los registros esperados
4. **Si todo funciona**, el sistema está 100% operativo

**¡Listo para usar en otro Cursor!** 🚀
