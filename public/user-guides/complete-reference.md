# 📚 Referencia Completa de la API

**Documentación técnica completa de todos los endpoints, tipos y funciones**

---

## 🎯 **Índice de Contenidos**

### **1. Autenticación y Autorización**
### **2. Tipos GraphQL**
### **3. Queries Disponibles**
### **4. Mutations Disponibles**
### **5. Subscriptions**
### **6. Códigos de Error**
### **7. Rate Limiting**
### **8. Webhooks**
### **9. Ejemplos Avanzados**

---

## 🔐 **1. Autenticación y Autorización**

### **Generar Token**
```graphql
mutation GenerateToken($input: GenerateTokenInput!) {
  generateToken(input: $input) {
    success
    token
    user {
      uid
      email
      role
      development
      brand
      client_id
      permissions
    }
    errors
  }
}
```

**Input:**
```typescript
type GenerateTokenInput {
  uid: String!
  email: String!
  role: String
  development: String
  brand: String
  client_id: String
  permissions: [String!]
}
```

### **Headers Requeridos**
```http
Authorization: Bearer <token>
Origin: https://tu-dominio.com
Content-Type: application/json
```

---

## 📋 **2. Tipos GraphQL**

### **Tipos Base**
```graphql
type Evento {
  id: ID!
  nombre: String!
  fecha: String!
  hora: String
  ubicacion: String
  direccion: String
  descripcion: String
  tipo: String
  presupuesto: Float
  estado: String
  invitados: [Invitado!]
  tareas: [Tarea!]
  createdAt: String
  updatedAt: String
}

type Invitado {
  id: ID!
  nombre: String!
  email: String
  telefono: String
  confirmado: Boolean
  fechaInvitacion: String
  fechaConfirmacion: String
  notas: String
}

type Tarea {
  id: ID!
  titulo: String!
  descripcion: String
  completada: Boolean
  fechaLimite: String
  responsable: String
  prioridad: String
  createdAt: String
  updatedAt: String
}

type Contacto {
  id: ID!
  nombre: String!
  apellidos: String!
  email: String
  telefono: String
  empresa: String
  cargo: String
  estado: String
  origen: String
  notas: String
  createdAt: String
  updatedAt: String
}

type Lead {
  id: ID!
  contacto: Contacto!
  estado: String!
  prioridad: String
  valor: Float
  fuente: String
  notas: String
  fechaConversion: String
  fechaActualizacion: String
}

type Campaña {
  id: ID!
  nombre: String!
  asunto: String
  mensaje: String!
  tipo: String!
  estado: String!
  fechaCreacion: String
  fechaProgramada: String
  destinatarios: DestinatariosInfo
  estadisticas: EstadisticasCampaña
}

type DestinatariosInfo {
  total: Int!
  segmentos: [String!]
  enviados: Int
  entregados: Int
  fallidos: Int
}

type EstadisticasCampaña {
  enviados: Int!
  entregados: Int!
  abiertos: Int
  clicks: Int
  respuestas: Int
  porcentajeApertura: Float
  porcentajeClicks: Float
  porcentajeRespuesta: Float
}
```

### **Tipos de Input**
```graphql
input CreateEventInput {
  nombre: String!
  fecha: String!
  hora: String
  ubicacion: String
  direccion: String
  descripcion: String
  tipo: String
  presupuesto: Float
  estado: String
}

input UpdateEventInput {
  nombre: String
  fecha: String
  hora: String
  ubicacion: String
  direccion: String
  descripcion: String
  tipo: String
  presupuesto: Float
  estado: String
}

input CreateContactInput {
  nombre: String!
  apellidos: String!
  email: String
  telefono: String
  empresa: String
  cargo: String
  estado: String
  origen: String
  notas: String
}

input CreateLeadInput {
  estado: String!
  prioridad: String
  valor: Float
  fuente: String
  notas: String
}

input SendWhatsAppMessageInput {
  numero: String!
  mensaje: String!
  tipo: String
}

input CreateEmailCampaignInput {
  nombre: String!
  asunto: String!
  tipo: String!
  template: String
  segmentos: [String!]
  fechaProgramada: String
}

input CreateWhatsAppCampaignInput {
  nombre: String!
  mensaje: String!
  tipo: String!
  template: String
  segmentos: [String!]
  fechaProgramada: String
}
```

### **Tipos de Respuesta**
```graphql
type EventResponse {
  success: Boolean!
  event: Evento
  errors: [String!]
}

type EventsResponse {
  success: Boolean!
  events: [Evento!]
  totalCount: Int!
  errors: [String!]
}

type ContactResponse {
  success: Boolean!
  contact: Contacto
  errors: [String!]
}

type ContactsResponse {
  success: Boolean!
  contacts: [Contacto!]
  totalCount: Int!
  errors: [String!]
}

type LeadResponse {
  success: Boolean!
  lead: Lead
  errors: [String!]
}

type LeadsResponse {
  success: Boolean!
  leads: [Lead!]
  totalCount: Int!
  errors: [String!]
}

type CampaignResponse {
  success: Boolean!
  campaign: Campaña
  errors: [String!]
}

type MessageResponse {
  success: Boolean!
  messageId: String
  status: String
  timestamp: String
  errors: [String!]
}
```

---

## 🔍 **3. Queries Disponibles**

### **Eventos**
```graphql
# Obtener todos los eventos del usuario
query GetUserEvents {
  getUserEvents {
    success
    events {
      id
      nombre
      fecha
      ubicacion
      estado
      invitados {
        id
        nombre
        confirmado
      }
      tareas {
        id
        titulo
        completada
      }
    }
    totalCount
    errors
  }
}

# Obtener evento por ID
query GetEventById($id: ID!) {
  getEventById(id: $id) {
    success
    event {
      id
      nombre
      fecha
      hora
      ubicacion
      direccion
      descripcion
      tipo
      presupuesto
      estado
      invitados {
        id
        nombre
        email
        telefono
        confirmado
        fechaInvitacion
        fechaConfirmacion
      }
      tareas {
        id
        titulo
        descripcion
        completada
        fechaLimite
        responsable
        prioridad
      }
      createdAt
      updatedAt
    }
    errors
  }
}

# Buscar eventos
query SearchEvents($termino: String!, $filtros: EventFilters) {
  searchEvents(termino: $termino, filtros: $filtros) {
    success
    events {
      id
      nombre
      fecha
      ubicacion
      estado
      score
    }
    totalCount
    errors
  }
}

# Obtener estadísticas de evento
query GetEventStats($eventId: ID!) {
  getEventStats(eventId: $eventId) {
    success
    stats {
      totalInvitados
      invitadosConfirmados
      invitadosPendientes
      porcentajeConfirmacion
      tareasCompletadas
      tareasPendientes
      presupuestoTotal
      presupuestoGastado
      diasRestantes
    }
    errors
  }
}
```

### **Contactos**
```graphql
# Obtener todos los contactos
query GetContacts {
  getContacts {
    success
    contacts {
      id
      nombre
      apellidos
      email
      telefono
      empresa
      cargo
      estado
      origen
      createdAt
    }
    totalCount
    errors
  }
}

# Obtener contacto por ID
query GetContactById($id: ID!) {
  getContactById(id: $id) {
    success
    contact {
      id
      nombre
      apellidos
      email
      telefono
      empresa
      cargo
      estado
      origen
      notas
      createdAt
      updatedAt
    }
    errors
  }
}

# Buscar contactos
query SearchContacts($termino: String!) {
  searchContacts(termino: $termino) {
    success
    contacts {
      id
      nombre
      apellidos
      email
      telefono
      empresa
    }
    totalCount
    errors
  }
}
```

### **Leads**
```graphql
# Obtener leads por estado
query GetLeadsByStatus($estado: String!) {
  getLeadsByStatus(estado: $estado) {
    success
    leads {
      id
      contacto {
        id
        nombre
        apellidos
        email
        telefono
      }
      estado
      prioridad
      valor
      fuente
      notas
      fechaConversion
    }
    totalCount
    errors
  }
}

# Obtener lead por ID
query GetLeadById($id: ID!) {
  getLeadById(id: $id) {
    success
    lead {
      id
      contacto {
        id
        nombre
        apellidos
        email
        telefono
        empresa
      }
      estado
      prioridad
      valor
      fuente
      notas
      fechaConversion
      fechaActualizacion
    }
    errors
  }
}
```

### **Campañas**
```graphql
# Obtener campañas de email
query GetEmailCampaigns {
  getEmailCampaigns {
    success
    campaigns {
      id
      nombre
      asunto
      tipo
      estado
      fechaCreacion
      fechaProgramada
      destinatarios {
        total
        enviados
        entregados
      }
      estadisticas {
        enviados
        entregados
        abiertos
        clicks
        porcentajeApertura
        porcentajeClicks
      }
    }
    totalCount
    errors
  }
}

# Obtener campañas de WhatsApp
query GetWhatsAppCampaigns {
  getWhatsAppCampaigns {
    success
    campaigns {
      id
      nombre
      mensaje
      tipo
      estado
      fechaCreacion
      fechaProgramada
      destinatarios {
        total
        enviados
        entregados
      }
    }
    totalCount
    errors
  }
}

# Obtener estadísticas de campaña
query GetCampaignStats($campanaId: ID!) {
  getCampaignStats(campanaId: $campanaId) {
    success
    stats {
      enviados
      entregados
      abiertos
      clicks
      respuestas
      porcentajeApertura
      porcentajeClicks
      porcentajeRespuesta
    }
    errors
  }
}
```

### **WhatsApp**
```graphql
# Obtener estado de WhatsApp
query GetWhatsAppStatus {
  getWhatsAppStatus {
    success
    status {
      conectado
      numeroVerificado
      plantillasAprobadas
      mensajesEnviados
      ultimaActividad
    }
    errors
  }
}

# Obtener estadísticas de WhatsApp
query GetWhatsAppStats {
  getWhatsAppStats {
    success
    stats {
      mensajesEnviados
      mensajesEntregados
      mensajesLeidos
      mensajesFallidos
      porcentajeEntrega
      porcentajeLectura
      tiempoPromedioEntrega
      conversacionesActivas
      chatbotInteracciones
    }
    errors
  }
}

# Obtener historial de mensajes
query GetMessageHistory($numero: String!, $limite: Int) {
  getMessageHistory(numero: $numero, limite: $limite) {
    success
    mensajes {
      id
      contenido
      tipo
      direccion
      timestamp
      estado
    }
    totalCount
    errors
  }
}
```

---

## ✏️ **4. Mutations Disponibles**

### **Eventos**
```graphql
# Crear evento
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    success
    event {
      id
      nombre
      fecha
      ubicacion
      estado
    }
    errors
  }
}

# Actualizar evento
mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
  updateEvent(id: $id, input: $input) {
    success
    event {
      id
      nombre
      fecha
      ubicacion
      estado
      updatedAt
    }
    errors
  }
}

# Eliminar evento
mutation DeleteEvent($id: ID!) {
  deleteEvent(id: $id) {
    success
    message
    errors
  }
}

# Agregar invitado a evento
mutation AddGuestToEvent($eventId: ID!, $input: AddGuestInput!) {
  addGuestToEvent(eventId: $eventId, input: $input) {
    success
    guest {
      id
      nombre
      email
      telefono
      confirmado
    }
    errors
  }
}

# Confirmar invitado
mutation ConfirmGuest($eventId: ID!, $guestId: ID!) {
  confirmGuest(eventId: $eventId, guestId: $guestId) {
    success
    guest {
      id
      nombre
      confirmado
      fechaConfirmacion
    }
    errors
  }
}

# Enviar invitaciones de evento
mutation SendEventInvitations($eventId: ID!) {
  sendEventInvitations(eventId: $eventId) {
    success
    sentCount
    errors
  }
}

# Programar recordatorio de evento
mutation ScheduleEventReminder($eventId: ID!, $diasAntes: Int!) {
  scheduleEventReminder(eventId: $eventId, diasAntes: $diasAntes) {
    success
    reminderId
    fechaEnvio
    errors
  }
}
```

### **Contactos**
```graphql
# Crear contacto
mutation CreateContact($input: CreateContactInput!) {
  createContact(input: $input) {
    success
    contact {
      id
      nombre
      apellidos
      email
      telefono
      empresa
    }
    errors
  }
}

# Actualizar contacto
mutation UpdateContact($id: ID!, $input: UpdateContactInput!) {
  updateContact(id: $id, input: $input) {
    success
    contact {
      id
      nombre
      apellidos
      email
      telefono
      empresa
      updatedAt
    }
    errors
  }
}

# Eliminar contacto
mutation DeleteContact($id: ID!) {
  deleteContact(id: $id) {
    success
    message
    errors
  }
}
```

### **Leads**
```graphql
# Convertir contacto en lead
mutation ConvertToLead($contactoId: ID!, $input: CreateLeadInput!) {
  convertToLead(contactoId: $contactoId, input: $input) {
    success
    lead {
      id
      contacto {
        id
        nombre
        apellidos
        email
      }
      estado
      prioridad
      valor
      fuente
      fechaConversion
    }
    errors
  }
}

# Actualizar estado de lead
mutation UpdateLeadStatus($leadId: ID!, $estado: String!) {
  updateLeadStatus(leadId: $leadId, estado: $estado) {
    success
    lead {
      id
      estado
      fechaActualizacion
    }
    errors
  }
}

# Actualizar lead
mutation UpdateLead($id: ID!, $input: UpdateLeadInput!) {
  updateLead(id: $id, input: $input) {
    success
    lead {
      id
      prioridad
      valor
      fuente
      notas
      fechaActualizacion
    }
    errors
  }
}
```

### **Campañas**
```graphql
# Crear campaña de email
mutation CreateEmailCampaign($input: CreateEmailCampaignInput!) {
  createEmailCampaign(input: $input) {
    success
    campaign {
      id
      nombre
      asunto
      tipo
      estado
      fechaCreacion
      fechaProgramada
      destinatarios {
        total
        segmentos
      }
    }
    errors
  }
}

# Crear campaña de WhatsApp
mutation CreateWhatsAppCampaign($input: CreateWhatsAppCampaignInput!) {
  createWhatsAppCampaign(input: $input) {
    success
    campaign {
      id
      nombre
      mensaje
      tipo
      estado
      fechaCreacion
      fechaProgramada
      destinatarios {
        total
        segmentos
      }
    }
    errors
  }
}

# Enviar campaña
mutation SendCampaign($campanaId: ID!) {
  sendCampaign(campanaId: $campanaId) {
    success
    sentCount
    errors
  }
}

# Ejecutar campaña de WhatsApp
mutation ExecuteWhatsAppCampaign($campanaId: ID!) {
  executeWhatsAppCampaign(campanaId: $campanaId) {
    success
    resultado {
      mensajesEnviados
      mensajesEntregados
      mensajesFallidos
      tiempoEjecucion
    }
    errors
  }
}
```

### **WhatsApp**
```graphql
# Enviar mensaje de WhatsApp
mutation SendWhatsAppMessage($input: SendWhatsAppMessageInput!) {
  sendWhatsAppMessage(input: $input) {
    success
    messageId
    status
    timestamp
    errors
  }
}

# Enviar plantilla de WhatsApp
mutation SendWhatsAppTemplate($input: SendWhatsAppTemplateInput!) {
  sendWhatsAppTemplate(input: $input) {
    success
    messageId
    status
    timestamp
    errors
  }
}

# Enviar multimedia por WhatsApp
mutation SendWhatsAppMedia($input: SendWhatsAppMediaInput!) {
  sendWhatsAppMedia(input: $input) {
    success
    messageId
    status
    timestamp
    errors
  }
}
```

---

## 📡 **5. Subscriptions**

### **Eventos en Tiempo Real**
```graphql
subscription EventosEnTiempoReal {
  eventosEnTiempoReal {
    tipo
    evento {
      id
      nombre
      fecha
      ubicacion
      estado
    }
    timestamp
  }
}
```

### **Mensajes en Tiempo Real**
```graphql
subscription MensajesEnTiempoReal {
  mensajesEnTiempoReal {
    tipo
    mensaje {
      id
      contenido
      numero
      estado
      timestamp
    }
    timestamp
  }
}
```

### **Campañas en Tiempo Real**
```graphql
subscription CampanasEnTiempoReal {
  campanasEnTiempoReal {
    tipo
    campaña {
      id
      nombre
      estado
      estadisticas {
        enviados
        entregados
        abiertos
      }
    }
    timestamp
  }
}
```

---

## ❌ **6. Códigos de Error**

### **Errores de Autenticación**
```json
{
  "error": "UNAUTHORIZED",
  "code": "AUTH_001",
  "message": "Token de autenticación requerido"
}

{
  "error": "INVALID_TOKEN",
  "code": "AUTH_002",
  "message": "Token de autenticación inválido o expirado"
}

{
  "error": "INSUFFICIENT_PERMISSIONS",
  "code": "AUTH_003",
  "message": "Permisos insuficientes para realizar esta acción"
}
```

### **Errores de Validación**
```json
{
  "error": "VALIDATION_ERROR",
  "code": "VAL_001",
  "message": "Datos de entrada inválidos",
  "details": {
    "field": "email",
    "message": "Formato de email inválido"
  }
}

{
  "error": "REQUIRED_FIELD",
  "code": "VAL_002",
  "message": "Campo requerido",
  "details": {
    "field": "nombre",
    "message": "El campo nombre es obligatorio"
  }
}
```

### **Errores de Recursos**
```json
{
  "error": "NOT_FOUND",
  "code": "RES_001",
  "message": "Recurso no encontrado",
  "details": {
    "resource": "evento",
    "id": "123"
  }
}

{
  "error": "DUPLICATE_RESOURCE",
  "code": "RES_002",
  "message": "Recurso duplicado",
  "details": {
    "resource": "contacto",
    "field": "email",
    "value": "test@ejemplo.com"
  }
}
```

### **Errores de Rate Limiting**
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "code": "RL_001",
  "message": "Límite de peticiones excedido",
  "details": {
    "limit": 100,
    "window": "1 minute",
    "retryAfter": 60
  }
}
```

### **Errores de WhatsApp**
```json
{
  "error": "WHATSAPP_NOT_CONNECTED",
  "code": "WA_001",
  "message": "WhatsApp no está conectado"
}

{
  "error": "INVALID_PHONE_NUMBER",
  "code": "WA_002",
  "message": "Número de teléfono inválido"
}

{
  "error": "TEMPLATE_NOT_APPROVED",
  "code": "WA_003",
  "message": "Plantilla no aprobada por WhatsApp"
}
```

---

## ⚡ **7. Rate Limiting**

### **Límites por Tipo de Usuario**

| Tipo | Requests/Minuto | Requests/Hora | Requests/Día |
|------|----------------|---------------|--------------|
| **Free** | 60 | 1,000 | 10,000 |
| **Pro** | 300 | 10,000 | 100,000 |
| **Enterprise** | 1,000 | 50,000 | 500,000 |

### **Headers de Rate Limiting**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
X-RateLimit-Retry-After: 60
```

### **Códigos de Estado**
- **200**: Petición exitosa
- **429**: Rate limit excedido
- **401**: No autenticado
- **403**: Sin permisos
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

---

## 🔗 **8. Webhooks**

### **Configurar Webhook**
```graphql
mutation CreateWebhook($input: CreateWebhookInput!) {
  createWebhook(input: $input) {
    success
    webhook {
      id
      url
      eventos
      secret
      estado
      ultimaActividad
    }
    errors
  }
}
```

### **Eventos Disponibles**
```javascript
const eventosWebhook = [
  "evento.creado",
  "evento.actualizado", 
  "evento.eliminado",
  "contacto.creado",
  "contacto.actualizado",
  "contacto.eliminado",
  "lead.creado",
  "lead.actualizado",
  "lead.convertido",
  "campaña.creada",
  "campaña.enviada",
  "campaña.completada",
  "mensaje.enviado",
  "mensaje.entregado",
  "mensaje.leido",
  "mensaje.fallido"
];
```

### **Estructura del Webhook**
```json
{
  "id": "webhook_123",
  "evento": "evento.creado",
  "timestamp": "2025-10-17T10:30:00Z",
  "datos": {
    "evento": {
      "id": "evento_456",
      "nombre": "Mi Boda Perfecta",
      "fecha": "2025-12-25",
      "ubicacion": "Hotel Maravilloso"
    }
  },
  "metadata": {
    "version": "1.0",
    "organizacion": "bodasdehoy"
  }
}
```

### **Verificación de Firma**
```javascript
const crypto = require('crypto');

function verificarFirmaWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
}
```

---

## 🎯 **9. Ejemplos Avanzados**

### **Paginación Cursor-Based**
```graphql
query EventosPaginados($first: Int, $after: String) {
  eventos(first: $first, after: $after) {
    edges {
      node {
        id
        nombre
        fecha
        estado
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

### **Búsqueda Avanzada con Filtros**
```graphql
query BusquedaAvanzada($input: BusquedaAvanzadaInput!) {
  busquedaAvanzada(input: $input) {
    success
    resultados {
      eventos {
        id
        nombre
        fecha
        ubicacion
        score
      }
      contactos {
        id
        nombre
        apellidos
        email
        score
      }
    }
    metadata {
      totalResultados
      tiempoBusqueda
      filtrosAplicados
    }
  }
}
```

### **Batch Operations**
```graphql
mutation BatchCreateContacts($inputs: [CreateContactInput!]!) {
  batchCreateContacts(inputs: $inputs) {
    success
    contacts {
      id
      nombre
      apellidos
      email
    }
    errores {
      indice
      error
    }
    estadisticas {
      total
      exitosos
      fallidos
    }
  }
}
```

---

## 📊 **Estadísticas y Monitoreo**

### **Obtener Métricas del Sistema**
```graphql
query GetSystemMetrics {
  getSystemMetrics {
    success
    metrics {
      api {
        requestsTotal
        requestsPerMinute
        averageResponseTime
        errorRate
      }
      database {
        connections
        queriesPerSecond
        averageQueryTime
      }
      whatsapp {
        messagesSent
        deliveryRate
        readRate
      }
      cache {
        hitRate
        missRate
        size
      }
    }
    timestamp
  }
}
```

### **Health Check**
```graphql
query HealthCheck {
  healthCheck {
    status
    services {
      api
      database
      whatsapp
      cache
      queue
    }
    version
    uptime
    timestamp
  }
}
```

---

## 🎯 **Próximos Pasos**

### **¿Necesitas más información?**
👉 **[Contactar Soporte](mailto:soporte@eventosorganizador.com)**

### **¿Quieres ver ejemplos prácticos?**
👉 **[Ver Código de Ejemplo](./code-examples.md)**

### **¿Necesitas personalización?**
👉 **[Ver Personalización](./customization.md)**

---

## 💡 **Consejos de Uso**

1. **Optimiza queries:** Usa solo los campos que necesitas
2. **Maneja errores:** Implementa manejo robusto de errores
3. **Implementa cache:** Reduce llamadas innecesarias
4. **Monitorea uso:** Revisa métricas regularmente
5. **Actualiza tokens:** Renueva tokens antes de que expiren

---

**¿Necesitas ayuda con la API?** 📧 soporte@eventosorganizador.com
