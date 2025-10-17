# 🤖 Instrucciones para Cliente N8N - API Eventos Organizador

**Fecha:** 12 de septiembre de 2025  
**Cliente:** Servicio N8N - Eventos Organizador  
**Proyecto:** Verificación de Servicios Públicos  

---

## 📋 Resumen Ejecutivo

Este documento contiene las instrucciones específicas para verificar el funcionamiento de los servicios API GraphQL y MCP desde las URLs públicas, diseñado especialmente para el cliente que maneja el servicio N8N.

### 🎯 Estado Actual
- **API Health (Producción):** ✅ FUNCIONANDO
- **API Health (Test):** ✅ FUNCIONANDO  
- **GraphQL (Producción):** ✅ FUNCIONANDO
- **GraphQL (Test):** ✅ FUNCIONANDO
- **MCP (Producción):** ✅ FUNCIONANDO
- **MCP (Test):** ✅ FUNCIONANDO

---

## 🔗 Endpoints Públicos Disponibles

### 🌐 Producción (api2.eventosorganizador.com)

#### ✅ Funcionando
- **API Health:** `https://api2.eventosorganizador.com/health`
- **GraphQL:** `https://api2.eventosorganizador.com/graphql`
- **MCP Health:** `http://api2.eventosorganizador.com:4001/health`
- **MCP Tools:** `http://api2.eventosorganizador.com:4001/mcp`

### 🧪 Test (testapi2.eventosorganizador.com)

#### ✅ Funcionando
- **API Health:** `https://testapi2.eventosorganizador.com/health`
- **GraphQL:** `https://testapi2.eventosorganizador.com/graphql`
- **MCP Health:** `http://testapi2.eventosorganizador.com:3001/health`
- **MCP Tools:** `http://testapi2.eventosorganizador.com:3001/mcp`

---

## 🛠️ Scripts de Verificación Disponibles

### 1. Verificación Rápida
```bash
# Ejecutar desde el servidor
./verificar-servicios-publicos.sh
```

### 2. Pruebas Detalladas
```bash
# Ejecutar pruebas completas
node test-eventos-chat-publico.js
```

### 3. Verificación Manual
```bash
# Health Check Producción
curl -s https://api2.eventosorganizador.com/health

# Health Check Test
curl -s https://testapi2.eventosorganizador.com/health

# GraphQL Producción (funcionando)
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'

# MCP Producción (funcionando)
curl -X POST http://api2.eventosorganizador.com:4001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"health_check","arguments":{}},"id":1}'
```

---

## 🔧 Configuración para N8N

### 1. Nodo HTTP Request - Health Check

#### Producción
- **URL:** `https://api2.eventosorganizador.com/health`
- **Método:** GET
- **Timeout:** 10000ms
- **Headers:** `User-Agent: N8N-EventosOrganizador/1.0`

#### Test
- **URL:** `https://testapi2.eventosorganizador.com/health`
- **Método:** GET
- **Timeout:** 10000ms
- **Headers:** `User-Agent: N8N-EventosOrganizador/1.0`

### 2. Nodo HTTP Request - GraphQL Query

#### Producción (Funcionando)
- **URL:** `https://api2.eventosorganizador.com/graphql`
- **Método:** POST
- **Headers:** 
  - `Content-Type: application/json`
  - `User-Agent: N8N-EventosOrganizador/1.0`
- **Body:** JSON con query GraphQL

#### Test (Funcionando)
- **URL:** `https://testapi2.eventosorganizador.com/graphql`
- **Método:** POST
- **Headers:** 
  - `Content-Type: application/json`
  - `User-Agent: N8N-EventosOrganizador/1.0`
- **Body:** JSON con query GraphQL

### 3. Nodo HTTP Request - MCP Tool

#### Producción (Funcionando)
- **URL:** `http://api2.eventosorganizador.com:4001/mcp`
- **Método:** POST
- **Headers:** 
  - `Content-Type: application/json`
  - `User-Agent: N8N-EventosOrganizador/1.0`
- **Body:** JSON con método, parámetros e ID

#### Test (Funcionando)
- **URL:** `http://testapi2.eventosorganizador.com:3001/mcp`
- **Método:** POST
- **Headers:** 
  - `Content-Type: application/json`
  - `User-Agent: N8N-EventosOrganizador/1.0`
- **Body:** JSON con método, parámetros e ID

---

## 📊 Consultas de Prueba para N8N

### 1. Consulta de Eventos por Email (Creador)

```json
{
  "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { id name date type status description location participants userId development } }",
  "variables": {
    "userId": "bodasdehoy.com@gmail.com",
    "development": "false"
  }
}
```

### 2. Consulta de Eventos por Teléfono (Creador)

```json
{
  "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { id name date type status description location participants userId development } }",
  "variables": {
    "userId": "+34622440213",
    "development": "false"
  }
}
```

### 3. Consulta de Eventos Compartidos (Como Compartido)

```json
{
  "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { id name date type status description location participants userId development } }",
  "variables": {
    "userId": "bodasdehoy.com@gmail.com",
    "development": "false"
  }
}
```

### 4. Consulta de Eventos como Invitado

```json
{
  "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { id name date type status description location participants userId development } }",
  "variables": {
    "userId": "+34622440213",
    "development": "false"
  }
}
```

### 5. Herramienta MCP - Health Check

```json
{
  "method": "tools/call",
  "params": {
    "name": "health_check",
    "arguments": {}
  },
  "id": 1
}
```

### 6. Herramienta MCP - Eventos por Email

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_events_by_email",
    "arguments": {
      "email": "bodasdehoy.com@gmail.com",
      "development": "false"
    }
  },
  "id": 2
}
```

### 7. Herramienta MCP - Eventos por Teléfono

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_events_by_phone",
    "arguments": {
      "phone": "+34622440213",
      "development": "false"
    }
  },
  "id": 3
}
```

### 8. Herramienta MCP - Consulta de Evento Específico

```json
{
  "method": "tools/call",
  "params": {
    "name": "query_event",
    "arguments": {
      "eventId": "EVENT_ID_AQUI",
      "questions": [
        "¿Cuántos invitados confirmaron?",
        "¿Cuánto falta por pagar?",
        "¿Qué tareas hay pendientes para hoy?"
      ]
    }
  },
  "id": 4
}
```

---

## ✅ Estado Actual - Todos los Servicios Funcionando

### 1. Servicios Restaurados
- **GraphQL:** ✅ Funcionando en producción y test
- **MCP:** ✅ Funcionando en producción y test
- **API Health:** ✅ Funcionando en producción y test
- **Base de datos:** ✅ Conectada y operativa

### 2. Problemas Resueltos
- **Errores de TypeScript:** ✅ Corregidos
- **Servicios:** ✅ Iniciados correctamente
- **Espacio en disco:** ✅ Liberado
- **Configuración de red:** ✅ Funcionando

### 3. Configuración Actual
- **Nginx:** ✅ Proxy funcionando correctamente
- **SSL:** ✅ Certificados válidos
- **Puertos:** ✅ 4000 (API), 4001 (MCP) funcionando
- **Firebase:** ✅ Autenticación operativa

---

## 🚀 Instrucciones de Uso para N8N

### 1. Configuración Inicial
```bash
# Verificar que los servicios estén funcionando
curl -s https://api2.eventosorganizador.com/health
curl -s -X POST https://api2.eventosorganizador.com/graphql -H "Content-Type: application/json" -d '{"query":"{ __schema { types { name } } }"}'
curl -s -X POST http://api2.eventosorganizador.com:4001/mcp -H "Content-Type: application/json" -d '{"method":"tools/call","params":{"name":"health_check","arguments":{}},"id":1}'
```

### 2. Pruebas de Eventos
```bash
# Probar eventos por email
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { id name date location country type role permissions { canEditEvent canDeleteEvent canInviteGuests } } }","variables":{"userId":"bodasdehoy.com@gmail.com","development":"false"}}'

# Probar eventos por teléfono
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { id name date location country type role permissions { canEditEvent canDeleteEvent canInviteGuests } } }","variables":{"userId":"+34622440213","development":"false"}}'
```

### 3. Pruebas MCP
```bash
# Probar MCP con email
curl -X POST http://api2.eventosorganizador.com:4001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"get_events_by_email","arguments":{"email":"bodasdehoy.com@gmail.com","development":"false"}},"id":1}'

# Probar MCP con teléfono
curl -X POST http://api2.eventosorganizador.com:4001/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/call","params":{"name":"get_events_by_phone","arguments":{"phone":"+34622440213","development":"false"}},"id":2}'
```

---

## 📈 Monitoreo desde N8N

### 1. Workflow de Monitoreo
- **Frecuencia:** Cada 5 minutos
- **Timeout:** 10 segundos
- **Alertas:** Email si falla

### 2. Nodos Recomendados
- **HTTP Request** para health checks
- **IF** para evaluar respuestas
- **Email** para alertas
- **Set** para logging

### 3. Configuración de Alertas
```json
{
  "to": "admin@eventosorganizador.com",
  "subject": "Alerta API Eventos Organizador",
  "body": "El servicio {{$json.service}} no responde en {{$json.environment}}"
}
```

---

## ✅ Checklist de Verificación

### Antes de Usar en N8N
- [ ] Health checks funcionando
- [ ] GraphQL respondiendo
- [ ] MCP respondiendo
- [ ] Certificados SSL válidos
- [ ] Tiempo de respuesta < 10 segundos

### Configuración N8N
- [ ] Nodos HTTP Request configurados
- [ ] Headers correctos
- [ ] Timeouts apropiados
- [ ] Manejo de errores implementado
- [ ] Alertas configuradas

### Monitoreo
- [ ] Workflow de monitoreo activo
- [ ] Alertas funcionando
- [ ] Logs siendo registrados
- [ ] Métricas siendo recopiladas

---

## 📞 Contacto y Soporte

- **Proyecto:** API Eventos Organizador
- **Cliente:** Servicio N8N
- **Documentación:** Este archivo
- **Scripts:** Disponibles en `/var/www/api-production`
- **Logs:** Disponibles en el servidor

---

## 🔄 Próximos Pasos

1. **✅ Servicios funcionando** - Todos los servicios están operativos
2. **✅ Endpoints verificados** - GraphQL y MCP respondiendo correctamente
3. **🔄 Configurar monitoreo** automático desde N8N
4. **🔄 Establecer alertas** de fallo
5. **🔄 Implementar workflows** de producción

---

## 📋 Archivos de Referencia

- `VERIFICACION_SERVICIOS_PUBLICOS.md` - Documentación completa
- `verificar-servicios-publicos.sh` - Script de verificación
- `test-eventos-chat-publico.js` - Pruebas detalladas
- `INSTRUCCIONES_VERIFICACION_SERVICIOS.md` - Instrucciones generales

---

*Documento generado el 12 de septiembre de 2025 para el cliente N8N*

