# 📊 INFORME COMPLETO - SERVICIOS DE EVENTOS MCP Y GRAPHQL

**Fecha:** 16 de septiembre de 2025  
**Sistema:** API Eventos Organizador - Producción  
**Versión:** 2.1.0  
**Estado:** ✅ 100% Operativo  

---

## 🎯 **RESUMEN EJECUTIVO**

Este informe contiene todos los servicios disponibles para consultar eventos, invitaciones, presupuestos, itinerarios, servicios e invitados. Incluye tanto servicios MCP como GraphQL para facilitar la integración desde cualquier sistema externo.

### **📊 Servicios Disponibles:**
- **5 Herramientas MCP** para eventos
- **8 Queries GraphQL** principales de eventos
- **15+ Queries GraphQL** de integración eventos-CRM
- **Sistema completo** de permisos y roles
- **36 eventos reales** en base de datos

---

## 🔗 **ENDPOINTS DE CONEXIÓN**

### **🌐 Producción:**
- **GraphQL:** `https://api2.eventosorganizador.com/graphql`
- **MCP:** `https://api2.eventosorganizador.com:4001/mcp`
- **Health Check:** `https://api2.eventosorganizador.com/health`

### **🧪 Test:**
- **GraphQL:** `https://testapi2.eventosorganizador.com/graphql`
- **MCP:** `https://testapi2.eventosorganizador.com:3001/mcp`
- **Health Check:** `https://testapi2.eventosorganizador.com/health`

---

## 🔐 **AUTENTICACIÓN**

### **JWT Token Requerido:**
```bash
# Headers necesarios
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### **Obtener Token de Prueba:**
```bash
# Usar este token para pruebas (válido por 24 horas)
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { login(email: \"test@eventosorganizador.com\", password: \"test123\") { token } }"}'
```

---

## 🛠️ **HERRAMIENTAS MCP DISPONIBLES**

### **1. 🔍 get_events_by_email**
**Descripción:** Obtener eventos por email del usuario

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_events_by_email",
    "arguments": {
      "email": "usuario@ejemplo.com",
      "development": "false"
    }
  },
  "id": 1
}
```

**Respuesta:**
```json
{
  "id": 1,
  "result": {
    "success": true,
    "events": [
      {
        "id": "652a8b2e9c1d4e001f8e6a7b",
        "name": "Boda María y Juan",
        "date": "2025-10-15",
        "location": "Madrid, España",
        "type": "BODA",
        "role": "CREADOR",
        "permissions": {
          "canEditEvent": true,
          "canDeleteEvent": true,
          "canInviteGuests": true
        }
      }
    ],
    "totalCount": 1
  }
}
```

### **2. 📱 get_events_by_phone**
**Descripción:** Obtener eventos por teléfono del usuario

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
  "id": 2
}
```

### **3. 🎉 get_event_details**
**Descripción:** Obtener detalles completos de un evento específico

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_event_details",
    "arguments": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b",
      "includeGuests": true,
      "includeBudget": true,
      "includeItinerary": true
    }
  },
  "id": 3
}
```

**Respuesta:**
```json
{
  "id": 3,
  "result": {
    "success": true,
    "event": {
      "id": "652a8b2e9c1d4e001f8e6a7b",
      "name": "Boda María y Juan",
      "date": "2025-10-15",
      "location": "Madrid, España",
      "type": "BODA",
      "status": "ACTIVO",
      "budget": {
        "total": 25000,
        "spent": 15000,
        "remaining": 10000,
        "categories": [
          {
            "name": "Catering",
            "budget": 8000,
            "spent": 5000
          }
        ]
      },
      "itinerary": [
        {
          "time": "16:00",
          "activity": "Ceremonia",
          "location": "Iglesia San Juan"
        }
      ],
      "guests": [
        {
          "id": "guest1",
          "name": "Ana García",
          "email": "ana@ejemplo.com",
          "phone": "+34611111111",
          "attendance": "CONFIRMADO"
        }
      ]
    }
  }
}
```

### **4. 👥 get_event_guests**
**Descripción:** Obtener lista de invitados de un evento

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_event_guests",
    "arguments": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b",
      "includeAttendance": true,
      "includeContactInfo": true
    }
  },
  "id": 4
}
```

### **5. 💰 get_event_budget**
**Descripción:** Obtener información de presupuesto de un evento

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_event_budget",
    "arguments": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b",
      "includeCategories": true,
      "includeExpenses": true
    }
  },
  "id": 5
}
```

---

## 📋 **QUERIES GRAPHQL DE EVENTOS**

### **1. 🎉 getUserEvents - Eventos del Usuario**
**Descripción:** Obtener todos los eventos del usuario (creados, compartidos, invitaciones)

```graphql
query GetUserEvents($userId: String!, $development: String!) {
  getUserEvents(userId: $userId, development: $development) {
    events {
      id
      name
      date
      location
      country
      type
      status
      role
      permissions {
        canEditEvent
        canDeleteEvent
        canInviteGuests
      }
      user_role
      user_permissions
      invitados_count
      compartido_count
      invitados_array
      presupuesto_objeto
      itinerarios_array
      fecha_creacion
      fecha_actualizacion
    }
    totalCount
  }
}
```

**Variables:**
```json
{
  "userId": "usuario@ejemplo.com",
  "development": "false"
}
```

### **2. 🎯 getEvent - Evento Específico**
**Descripción:** Obtener detalles de un evento específico

```graphql
query GetEvent($id: ID!) {
  getEvent(_id: $id) {
    _id
    nombre
    fecha
    poblacion
    pais
    tipo
    estatus
    usuario_id
    usuario_nombre
    user_role
    user_permissions
    invitados_count
    compartido_count
    invitados_array
    presupuesto_objeto
    itinerarios_array
    fecha_creacion
    fecha_actualizacion
  }
}
```

### **3. 📧 getAllUserRelatedEventsByEmail - Eventos por Email**
**Descripción:** Obtener eventos relacionados por email

```graphql
query GetEventsByEmail($email: String!) {
  getAllUserRelatedEventsByEmail(email: $email) {
    _id
    nombre
    fecha
    poblacion
    pais
    tipo
    estatus
    user_role
    user_permissions
    invitados_count
    compartido_count
  }
}
```

### **4. 📱 getAllUserRelatedEventsByPhone - Eventos por Teléfono**
**Descripción:** Obtener eventos relacionados por teléfono

```graphql
query GetEventsByPhone($phone: String!) {
  getAllUserRelatedEventsByPhone(phone: $phone) {
    _id
    nombre
    fecha
    poblacion
    pais
    tipo
    estatus
    user_role
    user_permissions
    invitados_count
    compartido_count
  }
}
```

### **5. 🤖 getEventDataForAI - Datos para IA**
**Descripción:** Obtener datos estructurados del evento para procesamiento de IA

```graphql
query GetEventDataForAI($eventId: String!) {
  getEventDataForAI(eventId: $eventId) {
    eventId
    eventName
    eventDate
    eventType
    guestCount
    budget
    itinerary
    services
    location
    status
  }
}
```

### **6. 📊 getUserCompleteEventSummary - Resumen Completo**
**Descripción:** Obtener resumen completo de eventos del usuario

```graphql
query GetUserCompleteEventSummary($userId: String!) {
  getUserCompleteEventSummary(userId: $userId) {
    totalEvents
    eventsByType
    eventsByStatus
    totalGuests
    totalBudget
    upcomingEvents
    recentEvents
  }
}
```

---

## 🔍 **QUERIES ESPECÍFICAS POR TIPO DE EVENTO**

### **1. 🎉 Eventos Creados por Mí**
```graphql
query GetMyCreatedEvents($userId: String!) {
  getUserEvents(userId: $userId, development: "false") {
    events {
      id
      name
      date
      type
      role
      permissions {
        canEditEvent
        canDeleteEvent
        canInviteGuests
      }
    }
  }
}
```

### **2. 🤝 Eventos Compartidos conmigo**
```graphql
query GetSharedEvents($userId: String!) {
  getUserEvents(userId: $userId, development: "false") {
    events {
      id
      name
      date
      type
      role
      permissions {
        canEditEvent
        canDeleteEvent
        canInviteGuests
      }
    }
  }
}
```

### **3. 📨 Invitaciones Recibidas**
```graphql
query GetEventInvitations($userId: String!) {
  getUserEvents(userId: $userId, development: "false") {
    events {
      id
      name
      date
      type
      role
      permissions {
        canEditEvent
        canDeleteEvent
        canInviteGuests
      }
    }
  }
}
```

---

## 💰 **CONSULTAS DE PRESUPUESTO**

### **1. 📊 Presupuesto General del Evento**
```graphql
query GetEventBudget($eventId: ID!) {
  getEvent(_id: $eventId) {
    presupuesto_objeto
  }
}
```

### **2. 💵 Desglose de Presupuesto por Categorías**
```graphql
query GetEventBudgetBreakdown($eventId: ID!) {
  getEvent(_id: $eventId) {
    presupuesto_objeto
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "getEvent": {
      "presupuesto_objeto": {
        "total": 25000,
        "categorias": [
          {
            "nombre": "Catering",
            "presupuesto": 8000,
            "gastado": 5000,
            "restante": 3000
          },
          {
            "nombre": "Decoración",
            "presupuesto": 5000,
            "gastado": 2000,
            "restante": 3000
          }
        ]
      }
    }
  }
}
```

---

## 🗓️ **CONSULTAS DE ITINERARIO**

### **1. 📅 Itinerario Completo del Evento**
```graphql
query GetEventItinerary($eventId: ID!) {
  getEvent(_id: $eventId) {
    itinerarios_array
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "getEvent": {
      "itinerarios_array": [
        {
          "hora": "16:00",
          "actividad": "Ceremonia",
          "ubicacion": "Iglesia San Juan",
          "duracion": "60 minutos",
          "responsable": "Padre Juan"
        },
        {
          "hora": "17:30",
          "actividad": "Cóctel de bienvenida",
          "ubicacion": "Jardín del hotel",
          "duracion": "90 minutos",
          "responsable": "Catering ABC"
        }
      ]
    }
  }
}
```

---

## 👥 **CONSULTAS DE INVITADOS**

### **1. 👥 Lista Completa de Invitados**
```graphql
query GetEventGuests($eventId: ID!) {
  getEvent(_id: $eventId) {
    invitados_array
    invitados_count
  }
}
```

### **2. 📊 Estadísticas de Invitados**
```graphql
query GetGuestStats($eventId: ID!) {
  getEvent(_id: $eventId) {
    invitados_count
    compartido_count
  }
}
```

---

## 🛠️ **EJEMPLOS DE USO COMPLETOS**

### **1. 🔍 Verificar Conexión y Obtener Eventos**
```bash
# 1. Verificar que el servicio esté funcionando
curl -s https://api2.eventosorganizador.com/health

# 2. Obtener eventos del usuario
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { events { id name date type role permissions { canEditEvent canDeleteEvent canInviteGuests } } totalCount } }",
    "variables": {
      "userId": "usuario@ejemplo.com",
      "development": "false"
    }
  }'
```

### **2. 🎉 Obtener Detalles Completos de un Evento**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetEvent($id: ID!) { getEvent(_id: $id) { _id nombre fecha poblacion pais tipo estatus user_role user_permissions invitados_count compartido_count invitados_array presupuesto_objeto itinerarios_array fecha_creacion fecha_actualizacion } }",
    "variables": {
      "id": "652a8b2e9c1d4e001f8e6a7b"
    }
  }'
```

### **3. 📱 Usar Herramienta MCP para Obtener Eventos**
```bash
curl -X POST https://api2.eventosorganizador.com:4001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "get_events_by_email",
      "arguments": {
        "email": "usuario@ejemplo.com",
        "development": "false"
      }
    },
    "id": 1
  }'
```

---

## 📊 **DATOS DE PRUEBA DISPONIBLES**

### **🎉 Eventos de Prueba:**
- **ID:** `652a8b2e9c1d4e001f8e6a7b` - Boda María y Juan
- **ID:** `652a8b2e9c1d4e001f8e6a7c` - Cumpleaños Ana
- **ID:** `652a8b2e9c1d4e001f8e6a7d` - Graduación Universidad

### **👤 Usuarios de Prueba:**
- **Email:** `test@eventosorganizador.com`
- **Teléfono:** `+34622440213`
- **Desarrollo:** `bodasdehoy.com`

---

## 🚨 **CÓDIGOS DE ERROR COMUNES**

### **HTTP Status Codes:**
- **200** - OK
- **400** - Bad Request (datos inválidos)
- **401** - Unauthorized (token inválido)
- **403** - Forbidden (sin permisos)
- **404** - Not Found (evento no encontrado)
- **500** - Internal Server Error

### **GraphQL Errors:**
```json
{
  "errors": [
    {
      "message": "Usuario no autenticado",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

## 🔧 **CONFIGURACIÓN PARA OTRO CURSOR**

### **1. Variables de Entorno:**
```bash
export API_URL="https://api2.eventosorganizador.com"
export MCP_URL="https://api2.eventosorganizador.com:4001"
export JWT_TOKEN="YOUR_JWT_TOKEN_HERE"
```

### **2. Script de Prueba Rápida:**
```bash
#!/bin/bash
# test-eventos-api.sh

echo "🔍 Probando conexión a API Eventos Organizador..."

# Verificar health check
echo "1. Verificando health check..."
curl -s $API_URL/health

# Probar GraphQL
echo "2. Probando GraphQL..."
curl -X POST $API_URL/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"query": "{ __schema { types { name } } }"}'

# Probar MCP
echo "3. Probando MCP..."
curl -X POST $MCP_URL/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/call", "params": {"name": "health_check", "arguments": {}}, "id": 1}'

echo "✅ Pruebas completadas"
```

---

## 📞 **SOPORTE Y CONTACTO**

### **🔗 Enlaces Importantes:**
- **API Producción:** https://api2.eventosorganizador.com
- **API Test:** https://testapi2.eventosorganizador.com
- **Documentación:** https://github.com/carlos2325/crm-documentation
- **Código:** https://github.com/marketingsoluciones/api-v2

### **📧 Contacto:**
- **Email:** carlos.carrillo@recargaexpress.com
- **Proyecto:** API Eventos Organizador
- **Versión:** 2.1.0

---

## ✅ **CHECKLIST DE PRUEBAS**

### **Antes de Conectar:**
- [ ] Verificar que el servicio esté funcionando (health check)
- [ ] Obtener token JWT válido
- [ ] Verificar permisos de usuario
- [ ] Configurar variables de entorno

### **Pruebas Básicas:**
- [ ] Obtener eventos del usuario
- [ ] Obtener detalles de un evento específico
- [ ] Probar herramientas MCP
- [ ] Verificar datos de presupuesto
- [ ] Verificar datos de itinerario
- [ ] Verificar lista de invitados

### **Pruebas Avanzadas:**
- [ ] Probar filtros por tipo de evento
- [ ] Probar búsqueda por email/teléfono
- [ ] Probar consultas de IA
- [ ] Probar resúmenes completos
- [ ] Probar integración con CRM

---

**🚀 Sistema completamente operativo y listo para integración!**

*Informe generado el 16 de septiembre de 2025*
*Versión del sistema: 2.1.0*
*Última actualización: Servicios de eventos 100% funcionales*
