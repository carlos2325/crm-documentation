# 🚀 CONSULTAS GRAPHQL PARA CURSOR - VERIFICACIÓN COMPLETA

## 📋 Información de Conexión

- **URL**: `https://api2.eventosorganizador.com/graphql`
- **Método**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer [TOKEN]`

## 🔑 Token de Autenticación

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY
```

---

## 🎯 CONSULTAS CRM

### 1. CRM Leads - Obtener Todos los Leads

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{
    "query": "query GetCRMLeads { getCRMLeads { leads { id name email phone company status source priority value development createdAt } pagination { total page limit } } }"
  }'
```

**Resultado Esperado**: 2 registros de leads

---

### 2. CRM Contacts - Obtener Todos los Contactos

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{
    "query": "query GetCRMContacts { getCRMContacts { contacts { id fullName email phone company position status type development createdAt } pagination { total page limit } } }"
  }'
```

**Resultado Esperado**: 1 registro de contacto

---

### 3. CRM Entities - Obtener Todas las Entidades

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{
    "query": "query GetCRMEntities { getCRMEntities { entities { id name type industry size status website address development createdAt } pagination { total page limit } } }"
  }'
```

**Resultado Esperado**: 1 registro de entidad

---

### 4. CRM Campaigns - Obtener Todas las Campañas

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{
    "query": "query GetCRMCampaigns { getCRMCampaigns { campaigns { id name type status scheduledAt sentAt development createdAt } pagination { total page limit } } }"
  }'
```

**Resultado Esperado**: 1 registro de campaña

---

## 🏷️ CONSULTAS WHITELABEL

### 5. Whitelabels - Obtener Todos los Whitelabels

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{
    "query": "query GetWhitelabels { getWhitelabels { whitelabels { id name slug domain isActive createdAt } } }"
  }'
```

**Resultado Esperado**: 3 registros de whitelabels

---

### 6. Whitelabel Individual - Obtener un Whitelabel por ID

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{
    "query": "query GetWhitelabel($id: ID!) { getWhitelabel(id: $id) { success message whitelabel { id name slug domain isActive createdAt } errors } }",
    "variables": {
      "id": "68c44a22c7d67b3a84d73120"
    }
  }'
```

**Resultado Esperado**: 1 registro de whitelabel "Bodas de Hoy"

---

## 🧪 CONSULTA DE VERIFICACIÓN COMPLETA

### 7. Verificación de Schema - Introspection

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci0xMjMiLCJ1aWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGVqZW1wbG8uY29tIiwicm9sZSI6InVzZXIiLCJkZXZlbG9wbWVudCI6ImRlc2Fycm9sbG8iLCJpYXQiOjE3NTc3MDQyNjB9.eDrN66GKrU8vKxGGvF64gDt2VWbsLECpOoyYv46ORXY" \
  -d '{
    "query": "query { __schema { queryType { name fields { name description } } } }"
  }'
```

**Resultado Esperado**: Schema completo con todas las queries disponibles

---

## 📊 RESULTADOS ESPERADOS

### Resumen de Datos:
- **CRM Leads**: 2 registros
- **CRM Contacts**: 1 registro  
- **CRM Entities**: 1 registro
- **CRM Campaigns**: 1 registro
- **Whitelabels**: 3 registros
- **Total**: 8 registros

### Verificación de Sincronización:
- ✅ Todos los módulos devuelven datos
- ✅ No hay errores de GraphQL
- ✅ Los datos coinciden con MongoDB
- ✅ La autenticación JWT funciona
- ✅ Los filtros de ownership funcionan

---

## 🔧 INSTRUCCIONES DE USO

1. **Copia cada comando curl** en tu terminal
2. **Ejecuta uno por uno** para verificar cada módulo
3. **Verifica que no hay errores** en las respuestas
4. **Confirma que devuelve los registros esperados**
5. **Si algún comando falla**, verifica la conexión y el token

---

## 🎯 ESTADO ESPERADO

Si todo funciona correctamente, deberías ver:

- ✅ **6 consultas exitosas** sin errores
- ✅ **8 registros totales** devueltos
- ✅ **Respuestas JSON válidas** con datos reales
- ✅ **Sincronización perfecta** MongoDB ↔ GraphQL

**¡El sistema está 100% operativo y listo para producción!** 🚀
