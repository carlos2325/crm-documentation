# 📋 DOCUMENTACIÓN CRM COMPLETA 2025

**Fecha de actualización:** 16 de Octubre, 2025  
**Versión:** 2.0.0 - 100% Operativa  
**Estado:** Producción - Estable

---

## 🚀 RESUMEN EJECUTIVO

El sistema CRM ha sido completamente optimizado y actualizado, alcanzando **100% de operatividad** en todas las funcionalidades principales. Se han implementado mejoras críticas en autenticación, gestión de contactos, leads, entidades y campañas.

---

## 🔧 FUNCIONALIDADES CRM IMPLEMENTADAS

### 1. GESTIÓN DE CONTACTOS
**Estado:** ✅ 100% Operativo

#### Queries disponibles:
```graphql
# Obtener todos los contactos
getCRMContacts: CRM_ContactsResponse!

# Obtener contacto específico
getCRMContact(id: ID!): CRM_ContactResponse!

# Buscar contactos
searchCRMContacts(searchTerm: String!): CRM_ContactsResponse!

# Obtener contactos destacados
getCRMStarredContacts: CRM_ContactsResponse!

# Obtener contactos por entidad
getCRMContactsByEntity(entityId: ID!): CRM_ContactsResponse!

# Obtener contactos con recordatorios
getCRMContactsWithReminders: CRM_ContactsResponse!
```

#### Mutations disponibles:
```graphql
# Crear contacto
createCRMContact(input: CRM_ContactInput!): CRM_ContactResponse!

# Actualizar contacto
updateCRMContact(id: ID!, input: CRM_ContactUpdateInput!): CRM_ContactResponse!

# Eliminar contacto
deleteCRMContact(id: ID!): CRM_ContactResponse!

# Agregar nota
addCRMContactNote(contactId: ID!, note: String!): CRM_ContactResponse!

# Actualizar nota
updateCRMContactNote(contactId: ID!, noteId: ID!, note: String!): CRM_ContactResponse!

# Eliminar nota
deleteCRMContactNote(contactId: ID!, noteId: ID!): CRM_ContactResponse!

# Agregar recordatorio
addCRMContactReminder(contactId: ID!, input: CRM_ReminderInput!): CRM_ContactResponse!

# Completar recordatorio
completeCRMContactReminder(contactId: ID!, reminderId: ID!): CRM_ContactResponse!

# Marcar como destacado
toggleCRMContactStar(contactId: ID!): CRM_ContactResponse!

# Actualizar sentimiento
updateCRMContactSentiment(contactId: ID!, sentiment: String!): CRM_ContactResponse!

# Actualizar último contacto
updateCRMContactLastContact(contactId: ID!, lastContact: DateTime!): CRM_ContactResponse!

# Compartir contacto
shareCRMContact(contactId: ID!, userId: ID!): CRM_ContactResponse!

# Dejar de compartir contacto
unshareCRMContact(contactId: ID!, userId: ID!): CRM_ContactResponse!
```

#### Tipos GraphQL:
```graphql
type CRM_Contact {
  id: ID!
  nombre: String!
  email: String
  telefono: String
  empresa: String
  cargo: String
  direccion: String
  ciudad: String
  pais: String
  notas: [CRM_Note!]!
  recordatorios: [CRM_Reminder!]!
  destacado: Boolean!
  sentimiento: String
  ultimoContacto: DateTime
  propietario: CRM_OwnerInfo!
  whitelabel: CRM_WhitelabelInfo!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CRM_Note {
  id: ID!
  contenido: String!
  autor: String!
  fecha: DateTime!
}

type CRM_Reminder {
  id: ID!
  titulo: String!
  descripcion: String
  fecha: DateTime!
  completado: Boolean!
  createdAt: DateTime!
}
```

---

### 2. GESTIÓN DE LEADS
**Estado:** ✅ 100% Operativo

#### Queries disponibles:
```graphql
# Obtener todos los leads
getCRMLeads: CRM_LeadsResponse!

# Obtener lead específico
getCRMLead(id: ID!): CRM_LeadResponse!

# Buscar leads
searchCRMLeads(searchTerm: String!): CRM_LeadsResponse!

# Obtener leads por estado
getCRMLeadsByStatus(status: String!): CRM_LeadsResponse!

# Obtener leads por asignado
getCRMLeadsByAssignee(assigneeId: ID!): CRM_LeadsResponse!

# Obtener leads por prioridad
getCRMLeadsByPriority(priority: String!): CRM_LeadsResponse!

# Obtener pipeline de leads
getCRMLeadsPipeline: CRM_LeadsPipelineResponse!

# Obtener estadísticas de leads
getCRMLeadStats: CRM_LeadStatsResponse!

# Obtener leads que requieren seguimiento
getCRMLeadsRequiringFollowUp: CRM_LeadsResponse!

# Obtener leads que se cierran pronto
getCRMLeadsClosingSoon: CRM_LeadsResponse!
```

#### Mutations disponibles:
```graphql
# Crear lead
createCRMLead(input: CRM_LeadInput!): CRM_LeadResponse!

# Actualizar lead
updateCRMLead(id: ID!, input: CRM_LeadUpdateInput!): CRM_LeadResponse!

# Eliminar lead
deleteCRMLead(id: ID!): CRM_LeadResponse!

# Mover lead a siguiente etapa
moveCRMLeadToNextStage(leadId: ID!): CRM_LeadResponse!

# Mover lead a etapa específica
moveCRMLeadToStage(leadId: ID!, stage: String!): CRM_LeadResponse!

# Marcar lead como ganado
markCRMLeadAsWon(leadId: ID!): CRM_LeadResponse!

# Marcar lead como perdido
markCRMLeadAsLost(leadId: ID!, razon: String): CRM_LeadResponse!

# Asignar lead
assignCRMLead(leadId: ID!, assigneeId: ID!): CRM_LeadResponse!

# Desasignar lead
unassignCRMLead(leadId: ID!): CRM_LeadResponse!

# Asignar múltiples leads
bulkAssignCRMLeads(leadIds: [ID!]!, assigneeId: ID!): CRM_LeadsResponse!

# Agregar nota
addCRMLeadNote(leadId: ID!, note: String!): CRM_LeadResponse!

# Actualizar nota
updateCRMLeadNote(leadId: ID!, noteId: ID!, note: String!): CRM_LeadResponse!

# Eliminar nota
deleteCRMLeadNote(leadId: ID!, noteId: ID!): CRM_LeadResponse!

# Agregar recordatorio
addCRMLeadReminder(leadId: ID!, input: CRM_ReminderInput!): CRM_LeadResponse!

# Actualizar recordatorio
updateCRMLeadReminder(leadId: ID!, reminderId: ID!, input: CRM_ReminderInput!): CRM_LeadResponse!

# Eliminar recordatorio
deleteCRMLeadReminder(leadId: ID!, reminderId: ID!): CRM_LeadResponse!

# Completar recordatorio
completeCRMLeadReminder(leadId: ID!, reminderId: ID!): CRM_LeadResponse!

# Agregar tags
addCRMLeadTags(leadId: ID!, tags: [String!]!): CRM_LeadResponse!

# Eliminar tags
removeCRMLeadTags(leadId: ID!, tags: [String!]!): CRM_LeadResponse!

# Actualizar prioridad
updateCRMLeadPriority(leadId: ID!, priority: String!): CRM_LeadResponse!

# Actualizar valor
updateCRMLeadValue(leadId: ID!, valor: Float!): CRM_LeadResponse!

# Actualizar probabilidad
updateCRMLeadProbability(leadId: ID!, probabilidad: Float!): CRM_LeadResponse!

# Actualizar sentimiento
updateCRMLeadSentiment(leadId: ID!, sentiment: String!): CRM_LeadResponse!

# Actualizar último contacto
updateCRMLeadLastContact(leadId: ID!, lastContact: DateTime!): CRM_LeadResponse!

# Compartir lead
shareCRMLead(leadId: ID!, userId: ID!): CRM_LeadResponse!

# Dejar de compartir lead
unshareCRMLead(leadId: ID!, userId: ID!): CRM_LeadResponse!

# Convertir lead a contacto
convertCRMLeadToContact(leadId: ID!): CRM_ContactResponse!

# Convertir lead a entidad
convertCRMLeadToEntity(leadId: ID!): CRM_EntityResponse!
```

#### Tipos GraphQL:
```graphql
type CRM_Lead {
  id: ID!
  titulo: String!
  descripcion: String
  valor: Float
  probabilidad: Float
  estado: String!
  prioridad: String!
  fuente: String
  notas: [CRM_Note!]!
  recordatorios: [CRM_Reminder!]!
  tags: [String!]!
  asignado: CRM_OwnerInfo
  propietario: CRM_OwnerInfo!
  whitelabel: CRM_WhitelabelInfo!
  createdAt: DateTime!
  updatedAt: DateTime!
  fechaCierre: DateTime
  ultimoContacto: DateTime
  sentimiento: String
}
```

---

### 3. GESTIÓN DE ENTIDADES
**Estado:** ✅ 100% Operativo

#### Queries disponibles:
```graphql
# Obtener todas las entidades
getCRMEntities: CRM_EntitiesResponse!

# Obtener entidad específica
getCRMEntity(id: ID!): CRM_EntityResponse!

# Buscar entidades
searchCRMEntities(searchTerm: String!): CRM_EntitiesResponse!

# Obtener entidades destacadas
getCRMStarredEntities: CRM_EntitiesResponse!

# Obtener entidades por industria
getCRMEntitiesByIndustry(industry: String!): CRM_EntitiesResponse!

# Obtener entidades por tamaño
getCRMEntitiesBySize(size: String!): CRM_EntitiesResponse!

# Obtener estadísticas de entidades
getCRMEntityStats: CRM_EntityStatsResponse!
```

#### Mutations disponibles:
```graphql
# Crear entidad
createCRMEntity(input: CRM_EntityInput!): CRM_EntityResponse!

# Actualizar entidad
updateCRMEntity(id: ID!, input: CRM_EntityUpdateInput!): CRM_EntityResponse!

# Eliminar entidad
deleteCRMEntity(id: ID!): CRM_EntityResponse!

# Agregar nota
addCRMEntityNote(entityId: ID!, note: String!): CRM_EntityResponse!

# Actualizar nota
updateCRMEntityNote(entityId: ID!, noteId: ID!, note: String!): CRM_EntityResponse!

# Eliminar nota
deleteCRMEntityNote(entityId: ID!, noteId: ID!): CRM_EntityResponse!

# Marcar como destacada
toggleCRMEntityStar(entityId: ID!): CRM_EntityResponse!

# Compartir entidad
shareCRMEntity(entityId: ID!, userId: ID!): CRM_EntityResponse!

# Dejar de compartir entidad
unshareCRMEntity(entityId: ID!, userId: ID!): CRM_EntityResponse!
```

#### Tipos GraphQL:
```graphql
type CRM_Entity {
  id: ID!
  nombre: String!
  tipo: String!
  industria: String
  tamaño: String
  direccion: String
  ciudad: String
  pais: String
  telefono: String
  email: String
  sitioWeb: String
  descripcion: String
  notas: [CRM_Note!]!
  destacada: Boolean!
  propietario: CRM_OwnerInfo!
  whitelabel: CRM_WhitelabelInfo!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

### 4. GESTIÓN DE CAMPAÑAS
**Estado:** ✅ 100% Operativo

#### Queries disponibles:
```graphql
# Obtener todas las campañas
getCRMCampaigns: CRM_CampaignsResponse!

# Obtener campaña específica
getCRMCampaign(id: ID!): CRM_CampaignResponse!

# Buscar campañas
searchCRMCampaigns(searchTerm: String!): CRM_CampaignsResponse!
```

#### Mutations disponibles:
```graphql
# Crear campaña
createCRMCampaign(input: CRM_CampaignInput!): CRM_CampaignResponse!

# Actualizar campaña
updateCRMCampaign(id: ID!, input: CRM_CampaignUpdateInput!): CRM_CampaignResponse!

# Eliminar campaña
deleteCRMCampaign(id: ID!): CRM_CampaignResponse!

# Compartir campaña
shareCRMCampaign(campaignId: ID!, userId: ID!): CRM_CampaignResponse!

# Dejar de compartir campaña
unshareCRMCampaign(campaignId: ID!, userId: ID!): CRM_CampaignResponse!
```

#### Tipos GraphQL:
```graphql
type CRM_Campaign {
  id: ID!
  nombre: String!
  descripcion: String
  tipo: String!
  estado: String!
  fechaInicio: DateTime
  fechaFin: DateTime
  presupuesto: Float
  objetivo: String
  metricas: JSON
  propietario: CRM_OwnerInfo!
  whitelabel: CRM_WhitelabelInfo!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

---

### 5. PLANTILLAS DE EMAIL
**Estado:** ✅ 100% Operativo

#### Queries disponibles:
```graphql
# Obtener plantillas de email
getCRMEmailTemplates: CRM_EmailTemplatesResponse!

# Obtener plantilla específica
getCRMEmailTemplate(id: ID!): CRM_EmailTemplateResponse!
```

#### Mutations disponibles:
```graphql
# Crear plantilla de email
createCRMEmailTemplate(input: CRM_EmailTemplateInput!): CRM_EmailTemplateResponse!

# Actualizar plantilla
updateCRMEmailTemplate(id: ID!, input: CRM_EmailTemplateUpdateInput!): CRM_EmailTemplateResponse!

# Eliminar plantilla
deleteCRMEmailTemplate(id: ID!): CRM_EmailTemplateResponse!
```

---

### 6. PLANTILLAS DE WHATSAPP
**Estado:** ✅ 100% Operativo

#### Queries disponibles:
```graphql
# Obtener plantillas de WhatsApp
getCRMWhatsAppTemplates: CRM_WhatsAppTemplatesResponse!

# Obtener plantilla específica
getCRMWhatsAppTemplate(id: ID!): CRM_WhatsAppTemplateResponse!
```

#### Mutations disponibles:
```graphql
# Crear plantilla de WhatsApp
createCRMWhatsAppTemplate(input: CRM_WhatsAppTemplateInput!): CRM_WhatsAppTemplateResponse!

# Actualizar plantilla
updateCRMWhatsAppTemplate(id: ID!, input: CRM_WhatsAppTemplateUpdateInput!): CRM_WhatsAppTemplateResponse!

# Eliminar plantilla
deleteCRMWhatsAppTemplate(id: ID!): CRM_WhatsAppTemplateResponse!
```

---

## 🔐 AUTENTICACIÓN CRM

### Headers requeridos:
```http
Content-Type: application/json
Origin: https://tu-dominio.com
Authorization: Bearer <token>
```

### Ejemplo de autenticación:
```javascript
const authenticate = async () => {
  const response = await axios.post(API_URL, {
    query: `
      mutation {
        generateToken(input: {
          client_id: "crm-next"
          uid: "usuario-id"
          development: "bodasdehoy"
          brand: "Bodas de Hoy"
          email: "usuario@email.com"
        }) {
          success
          token
        }
      }
    `
  }, { headers });
  
  return response.data.data.generateToken.token;
};
```

---

## 📊 EJEMPLOS DE USO

### Crear un contacto:
```javascript
const createContact = async (token) => {
  const response = await axios.post(API_URL, {
    query: `
      mutation {
        createCRMContact(input: {
          nombre: "Juan Pérez"
          email: "juan@empresa.com"
          telefono: "+1234567890"
          empresa: "Empresa ABC"
          cargo: "Director"
        }) {
          success
          contact {
            id
            nombre
            email
            telefono
          }
        }
      }
    `
  }, { 
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data.data.createCRMContact;
};
```

### Crear un lead:
```javascript
const createLead = async (token) => {
  const response = await axios.post(API_URL, {
    query: `
      mutation {
        createCRMLead(input: {
          titulo: "Lead de prueba"
          descripcion: "Descripción del lead"
          valor: 50000
          probabilidad: 0.7
          estado: "nuevo"
          prioridad: "alta"
          fuente: "web"
        }) {
          success
          lead {
            id
            titulo
            valor
            estado
          }
        }
      }
    `
  }, { 
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data.data.createCRMLead;
};
```

### Obtener contactos:
```javascript
const getContacts = async (token) => {
  const response = await axios.post(API_URL, {
    query: `
      query {
        getCRMContacts {
          success
          contacts {
            id
            nombre
            email
            telefono
            empresa
            destacado
          }
        }
      }
    `
  }, { 
    headers: {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data.data.getCRMContacts;
};
```

---

## 🚨 NOTAS IMPORTANTES

1. **Siempre incluir** el header `Origin` en las peticiones
2. **Usar client_id** para identificar tu aplicación
3. **Respetar rate limits** configurados
4. **Validar respuestas** antes de procesar datos
5. **Manejar errores** de autenticación correctamente

---

## 📞 SOPORTE TÉCNICO

Para soporte técnico o consultas sobre la implementación:
- **Email:** soporte@eventosorganizador.com
- **Documentación:** Disponible en el repositorio
- **Status:** https://status.eventosorganizador.com

---

**¡El sistema CRM está 100% operativo y listo para producción!** 🎉





