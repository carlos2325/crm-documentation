# 📚 API Documentation - Eventos Organizador

**Versión:** 2.1.0  
**Base URL:** `https://api2.eventosorganizador.com`  
**Test URL:** `https://testapi2.eventosorganizador.com`  

---

## 🎯 **RESUMEN DE LA API**

### **📊 Estadísticas:**
- **43+ Queries CRM** GraphQL disponibles (incluyendo nuevas v2.1.0)
- **183 Mutations** GraphQL disponibles (incluyendo nuevas v2.1.0)
- **275 Tipos** de datos definidos (incluyendo nuevos v2.1.0)
- **5 Herramientas MCP** funcionando
- **Sistema completo** CRM + Whitelabel + Chat + **Contactos Virtuales**

---

## 🔗 **ENDPOINTS PRINCIPALES**

### **🌐 Producción:**
- **GraphQL:** `https://api2.eventosorganizador.com/graphql`
- **MCP:** `https://api2.eventosorganizador.com:4001/mcp`
- **Health:** `https://api2.eventosorganizador.com/health`

### **🧪 Test:**
- **GraphQL:** `https://testapi2.eventosorganizador.com/graphql`
- **MCP:** `https://testapi2.eventosorganizador.com:3001/mcp`
- **Health:** `https://testapi2.eventosorganizador.com/health`

---

## 🔐 **AUTENTICACIÓN**

### **JWT Token:**
```bash
# Headers requeridos
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### **Ejemplo de uso:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"query": "query { __schema { types { name } } }"}'
```

---

## 📋 **QUERIES PRINCIPALES**

### **1. 🎉 EVENTOS (8 queries)**

#### **getUserEvents** - Eventos del usuario
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
      role
      permissions {
        canEditEvent
        canDeleteEvent
        canInviteGuests
      }
    }
    totalCount
  }
}
```

#### **getEvent** - Evento específico
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
  }
}
```

### **2. 🏢 CRM AVANZADO (43+ queries)**

#### **🆕 CONTACTOS VIRTUALES (15+ queries nuevas)**

##### **getCRMVirtualContacts** - Contactos virtuales
```graphql
query GetCRMVirtualContacts($filters: CRM_VirtualContactFilters, $pagination: CRM_PaginationInput, $sort: CRM_SortInput) {
  getCRMVirtualContacts(filters: $filters, pagination: $pagination, sort: $sort) {
    virtualContacts {
      id
      firstName
      lastName
      fullName
      email
      phone
      source {
        originalEventId
        originalGuestId
        syncDate
      }
      eventInfo {
        eventName
        eventDate
        asistencia
        grupo
      }
      communication {
        emailStatus
        whatsappStatus
        lastContact
      }
      engagement {
        score
        lastInteraction
        totalInteractions
      }
      tags
      customFields
    }
    pagination {
      total
      page
      limit
    }
  }
}
```

##### **getCRMVirtualContact** - Contacto virtual específico
```graphql
query GetCRMVirtualContact($id: ID!) {
  getCRMVirtualContact(id: $id) {
    success
    virtualContact {
      id
      firstName
      lastName
      email
      phone
      eventInfo {
        eventName
        eventDate
        asistencia
      }
      engagement {
        score
        lastInteraction
      }
    }
    errors
  }
}
```

##### **searchCRMVirtualContacts** - Buscar contactos virtuales
```graphql
query SearchCRMVirtualContacts($searchTerm: String!, $filters: CRM_VirtualContactFilters) {
  searchCRMVirtualContacts(searchTerm: $searchTerm, filters: $filters) {
    virtualContacts {
      id
      fullName
      email
      eventInfo {
        eventName
      }
      engagement {
        score
      }
    }
    total
  }
}
```

#### **🆕 LISTAS EXTENDIDAS (12+ queries nuevas)**

##### **getCRMExtendedContactLists** - Listas extendidas
```graphql
query GetCRMExtendedContactLists($filters: CRM_ExtendedContactListFilters, $pagination: CRM_PaginationInput) {
  getCRMExtendedContactLists(filters: $filters, pagination: $pagination) {
    extendedContactLists {
      id
      name
      description
      totalMembers
      contactDetails {
        id
        fullName
        email
        type
      }
      virtualContactDetails {
        id
        fullName
        email
        eventInfo {
          eventName
        }
      }
      dynamicCriteria {
        enabled
        filters
      }
      tags
      createdAt
    }
    pagination {
      total
      page
      limit
    }
  }
}
```

##### **getCRMExtendedContactList** - Lista extendida específica
```graphql
query GetCRMExtendedContactList($id: ID!) {
  getCRMExtendedContactList(id: $id) {
    success
    extendedContactList {
      id
      name
      description
      totalMembers
      contactIds
      virtualContactIds
      dynamicCriteria {
        enabled
        filters
      }
    }
    errors
  }
}
```

#### **🆕 INTEGRACIÓN EVENTOS-CRM (20+ queries nuevas)**

##### **getCRMEventsWithVirtualContacts** - Eventos con contactos virtuales
```graphql
query GetCRMEventsWithVirtualContacts($filters: CRM_EventFilters, $pagination: CRM_PaginationInput) {
  getCRMEventsWithVirtualContacts(filters: $filters, pagination: $pagination) {
    id
    nombre
    fecha
    totalVirtualContacts
    virtualContacts {
      id
      fullName
      email
      eventInfo {
        asistencia
      }
    }
  }
}
```

##### **getCRMEventMessagingStats** - Estadísticas de mensajería por evento
```graphql
query GetCRMEventMessagingStats($eventId: ID!) {
  getCRMEventMessagingStats(eventId: $eventId) {
    eventId
    eventName
    totalCampaigns
    totalMessagesSent
    emailSent
    emailOpened
    emailClicked
    whatsappSent
    whatsappRead
    smsSent
    lastCampaignDate
  }
}
```

#### **📋 CRM TRADICIONAL (queries existentes)**

##### **getCRMLeads** - Leads del CRM
```graphql
query GetCRMLeads {
  getCRMLeads {
    leads {
      id
      name
      email
      phone
      company
      status
      source
      priority
      value
      development
      createdAt
    }
    pagination {
      total
      page
      limit
    }
  }
}
```

#### **getCRMContacts** - Contactos del CRM
```graphql
query GetCRMContacts {
  getCRMContacts {
    contacts {
      id
      fullName
      email
      phone
      company
      position
      status
      type
      development
      createdAt
    }
    pagination {
      total
      page
      limit
    }
  }
}
```

### **3. 🏷️ WHITELABEL (2 queries)**

#### **getWhitelabels** - Listar whitelabels
```graphql
query GetWhitelabels {
  getWhitelabels {
    whitelabels {
      id
      name
      slug
      domain
      isActive
      createdAt
    }
  }
}
```

#### **getWhitelabel** - Whitelabel específico
```graphql
query GetWhitelabel($id: ID!) {
  getWhitelabel(id: $id) {
    success
    message
    whitelabel {
      id
      name
      slug
      domain
      isActive
      createdAt
    }
    errors
  }
}
```

### **4. 💬 CHAT (7 queries)**

#### **getUserChats** - Chats del usuario
```graphql
query GetUserChats($userId: String!, $skip: Int, $limit: Int) {
  CHAT_getUserChats(userId: $userId, skip: $skip, limit: $limit) {
    total
    chats {
      _id
      titulo
      tipo
      participantes
      metadata {
        fecha_creacion
        fecha_ultima_actividad
        activo
      }
      mensajes {
        mensaje
        fecha_creacion
        emisor
        receptor
      }
    }
    hasNextPage
  }
}
```

---

## 📤 **MUTATIONS PRINCIPALES**

### **1. 🎉 EVENTOS**

#### **createEvent** - Crear evento
```graphql
mutation CreateEvent($input: EventInput!) {
  createEvent(input: $input) {
    _id
    nombre
    fecha
    tipo
    estatus
  }
}
```

#### **updateEvent** - Actualizar evento
```graphql
mutation UpdateEvent($id: ID!, $input: EventUpdateInput!) {
  updateEvent(_id: $id, input: $input) {
    _id
    nombre
    fecha
    tipo
    estatus
  }
}
```

### **2. 🏢 CRM AVANZADO**

#### **🆕 CONTACTOS VIRTUALES (10+ mutations nuevas)**

##### **syncCRMEventGuestsToVirtualContacts** - Sincronizar invitados
```graphql
mutation SyncCRMEventGuestsToVirtualContacts($eventId: ID!, $options: CRM_VirtualContactSyncOptions) {
  syncCRMEventGuestsToVirtualContacts(eventId: $eventId, options: $options) {
    success
    result {
      created
      updated
      totalProcessed
      errors
    }
    errors
  }
}
```

##### **createCRMVirtualContact** - Crear contacto virtual
```graphql
mutation CreateCRMVirtualContact($input: CRM_VirtualContactInput!) {
  createCRMVirtualContact(input: $input) {
    success
    virtualContact {
      id
      firstName
      lastName
      email
      phone
      eventInfo {
        eventName
      }
    }
    errors
  }
}
```

##### **updateCRMVirtualContact** - Actualizar contacto virtual
```graphql
mutation UpdateCRMVirtualContact($id: ID!, $input: CRM_VirtualContactUpdateInput!) {
  updateCRMVirtualContact(id: $id, input: $input) {
    success
    virtualContact {
      id
      firstName
      lastName
      engagement {
        score
      }
    }
    errors
  }
}
```

#### **🆕 LISTAS EXTENDIDAS (15+ mutations nuevas)**

##### **createCRMExtendedContactList** - Crear lista extendida
```graphql
mutation CreateCRMExtendedContactList($input: CRM_ExtendedContactListInput!) {
  createCRMExtendedContactList(input: $input) {
    success
    extendedContactList {
      id
      name
      description
      totalMembers
      contactIds
      virtualContactIds
    }
    errors
  }
}
```

##### **addCRMExtendedContactListMembers** - Agregar miembros
```graphql
mutation AddCRMExtendedContactListMembers($id: ID!, $contactIds: [ID!], $virtualContactIds: [ID!]) {
  addCRMExtendedContactListMembers(id: $id, contactIds: $contactIds, virtualContactIds: $virtualContactIds) {
    success
    extendedContactList {
      id
      totalMembers
    }
    errors
  }
}
```

#### **🆕 INTEGRACIÓN EVENTOS-CRM (15+ mutations nuevas)**

##### **createCRMEventExtendedContactList** - Crear lista para evento
```graphql
mutation CreateCRMEventExtendedContactList($eventId: ID!, $name: String!, $description: String, $tags: [String!]) {
  createCRMEventExtendedContactList(eventId: $eventId, name: $name, description: $description, tags: $tags) {
    success
    extendedContactList {
      id
      name
      totalMembers
    }
    errors
  }
}
```

##### **createCRMEventCampaign** - Crear campaña para evento
```graphql
mutation CreateCRMEventCampaign($eventId: ID!, $campaignInput: CRM_CampaignInput!) {
  createCRMEventCampaign(eventId: $eventId, campaignInput: $campaignInput) {
    success
    campaign {
      id
      name
      type
      extendedRecipientLists {
        id
        name
      }
    }
    errors
  }
}
```

#### **📋 CRM TRADICIONAL (mutations existentes)**

#### **createCRMLead** - Crear lead
```graphql
mutation CreateCRMLead($input: CRM_LeadInput!) {
  createCRMLead(input: $input) {
    id
    name
    email
    phone
    company
    status
    source
    priority
    value
  }
}
```

#### **updateCRMLead** - Actualizar lead
```graphql
mutation UpdateCRMLead($id: ID!, $input: CRM_LeadUpdateInput!) {
  updateCRMLead(id: $id, input: $input) {
    id
    name
    email
    phone
    company
    status
    source
    priority
    value
  }
}
```

### **3. 💬 CHAT**

#### **createChat** - Crear chat
```graphql
mutation CreateChat($input: CHAT_CreateChatInput!, $creadoPor: String!) {
  CHAT_createChat(input: $input, creadoPor: $creadoPor) {
    _id
    titulo
    tipo
    participantes
    metadata {
      fecha_creacion
      creado_por
    }
  }
}
```

#### **sendMessage** - Enviar mensaje
```graphql
mutation SendMessage($chatId: String!, $input: CHAT_CreateMessageInput!, $emisorId: String!) {
  CHAT_sendMessage(chatId: $chatId, input: $input, emisorId: $emisorId) {
    _id
    mensaje
    fecha_creacion
    emisor
    receptor
  }
}
```

---

## 🔧 **HERRAMIENTAS MCP**

### **1. Health Check**
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

### **2. Eventos por Email**
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_events_by_email",
    "arguments": {
      "email": "user@example.com",
      "development": "false"
    }
  },
  "id": 2
}
```

### **3. Eventos por Teléfono**
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

### **4. Chats del Usuario**
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_user_chats",
    "arguments": {
      "userId": "user@example.com",
      "limit": 10
    }
  },
  "id": 4
}
```

---

## 📊 **TIPOS DE DATOS PRINCIPALES**

### **1. Evento**
```graphql
type Event {
  _id: ID!
  nombre: String!
  fecha: String!
  poblacion: String
  pais: String
  tipo: String!
  estatus: String!
  usuario_id: String!
  usuario_nombre: String
  user_role: String
  user_permissions: EventPermissions
  invitados_count: Int
  compartido_count: Int
  invitados_array: [String]
  presupuesto_objeto: JSON
  itinerarios_array: [JSON]
  fecha_creacion: String
  fecha_actualizacion: String
}
```

### **2. CRM Lead**
```graphql
type CRM_Lead {
  id: ID!
  name: String!
  email: String
  phone: String
  company: String
  status: CRM_LeadStatus!
  source: String
  priority: CRM_LeadPriority
  value: Float
  development: String!
  createdAt: String!
  updatedAt: String
}
```

### **3. Whitelabel**
```graphql
type Whitelabel {
  id: ID!
  name: String!
  slug: String!
  domain: String
  isActive: Boolean!
  createdAt: String!
  updatedAt: String
  developer: WhitelabelDeveloper
}
```

### **4. Chat**
```graphql
type Chat {
  _id: ID!
  titulo: String
  tipo: CHAT_ChatType!
  participantes: [String!]!
  mensajes: [ChatMessage!]!
  configuracion: ChatConfig
  metadata: ChatMetadata
}
```

---

## 🚨 **CÓDIGOS DE ERROR**

### **HTTP Status Codes:**
- **200** - OK
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

### **GraphQL Errors:**
```json
{
  "errors": [
    {
      "message": "Usuario no autenticado",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "field": "getUserEvents"
      }
    }
  ]
}
```

---

## 🔍 **EJEMPLOS DE USO**

### **1. Obtener eventos del usuario:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { events { id name date type role } totalCount } }",
    "variables": {
      "userId": "user@example.com",
      "development": "false"
    }
  }'
```

### **2. Crear un lead en CRM:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMLead($input: CRM_LeadInput!) { createCRMLead(input: $input) { id name email phone company status } }",
    "variables": {
      "input": {
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "+34622440213",
        "company": "Empresa ABC",
        "status": "NEW",
        "source": "Website",
        "priority": "MEDIUM",
        "value": 5000
      }
    }
  }'
```

### **3. Obtener chats del usuario:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetUserChats($userId: String!, $skip: Int, $limit: Int) { CHAT_getUserChats(userId: $userId, skip: $skip, limit: $limit) { total chats { _id titulo tipo participantes } } }",
    "variables": {
      "userId": "user@example.com",
      "skip": 0,
      "limit": 10
    }
  }'
```

### **4. 🆕 Sincronizar invitados de evento a contactos virtuales:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation SyncCRMEventGuestsToVirtualContacts($eventId: ID!) { syncCRMEventGuestsToVirtualContacts(eventId: $eventId) { success result { created updated totalProcessed } } }",
    "variables": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b"
    }
  }'
```

### **5. 🆕 Crear lista extendida con contactos virtuales:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMExtendedContactList($input: CRM_ExtendedContactListInput!) { createCRMExtendedContactList(input: $input) { success extendedContactList { id name totalMembers } } }",
    "variables": {
      "input": {
        "name": "Invitados Boda María y Juan",
        "description": "Lista de invitados para la boda",
        "virtualContactIds": ["vc1", "vc2", "vc3"],
        "tags": ["boda", "evento"]
      }
    }
  }'
```

### **6. 🆕 Obtener contactos virtuales:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetCRMVirtualContacts { getCRMVirtualContacts { virtualContacts { id fullName email eventInfo { eventName } engagement { score } } pagination { total } } }"
  }'
```

### **7. 🆕 Crear campaña para evento:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMEventCampaign($eventId: ID!, $campaignInput: CRM_CampaignInput!) { createCRMEventCampaign(eventId: $eventId, campaignInput: $campaignInput) { success campaign { id name type } } }",
    "variables": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b",
      "campaignInput": {
        "name": "Recordatorio Boda",
        "type": "EMAIL",
        "templateId": "template123",
        "settings": {
          "trackOpens": true,
          "trackClicks": true
        }
      }
    }
  }'
```

---

## 📈 **LÍMITES Y RATE LIMITING**

### **Límites por endpoint:**
- **GraphQL:** 1000 requests/minuto
- **MCP:** 500 requests/minuto
- **Health Check:** 100 requests/minuto

### **Límites por usuario:**
- **Queries:** 1000/minuto
- **Mutations:** 100/minuto
- **Subscripciones:** 10 simultáneas

---

## 🔄 **VERSIONADO**

### **Versión actual:** 2.1.0
### **Compatibilidad:** GraphQL 2021
### **Deprecación:** 6 meses de aviso para cambios breaking

---

## 📞 **SOPORTE**

### **Documentación completa:**
- **Repositorio:** https://github.com/carlos2325/crm-documentation
- **Guía completa:** `GUIA_COMPLETA_CRM_WHITELABEL.md`
- **Consultas:** `CONSULTAS_PARA_CURSOR.md`
- **🆕 Sistema Contactos Virtuales:** `SISTEMA-CONTACTOS-VIRTUALES.md`
- **🆕 Estado Proyecto:** `ESTADO-PROYECTO-COMPLETO.md`
- **🆕 Changelog:** `CHANGELOG.md`

### **Contacto:**
- **Email:** carlos.carrillo@recargaexpress.com
- **Proyecto:** API Eventos Organizador

---

**🚀 API completamente documentada con nuevas funcionalidades v2.1.0!**

*Documentación generada el 16 de septiembre de 2025*
*Versión de la API: 2.1.0*
*Última actualización: Sistema 100% operativo con Contactos Virtuales*



