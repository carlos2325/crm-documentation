# 📱 SISTEMA DE WHATSAPP - DOCUMENTACIÓN COMPLETA

**Fecha:** 26 de Septiembre 2025  
**Versión:** 2.0  
**Estado:** ✅ Implementado en servicios, necesita endpoints GraphQL

---

## 🎯 **RESUMEN EJECUTIVO**

El sistema de WhatsApp está implementado a nivel de servicios con soporte para múltiples proveedores y configuración whitelabel, pero no tiene endpoints GraphQL expuestos. Funciona a través del sistema de mensajería unificado.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **📁 Archivos Implementados:**
- `src/services/messagingProvidersService.ts` - Servicio principal de mensajería
- `src/services/whitelabelEmailService.ts` - Servicio whitelabel (incluye WhatsApp)
- `src/graphql/typeDefs/crm/campaign.ts` - Tipos para campañas WhatsApp
- `src/db/models/crm/Campaign.ts` - Modelo de campañas

### **🔧 Proveedores Soportados:**
1. **WhatsApp Business API** - Principal
2. **Twilio WhatsApp** - Alternativo
3. **Meta WhatsApp** - Oficial

---

## 📋 **TIPOS GRAPHQL DISPONIBLES**

### **1. Tipos de Campaña WhatsApp:**
```graphql
type CRM_WhatsAppTemplate {
  _id: ID!
  name: String!
  category: CRM_WhatsAppTemplateCategory!
  content: String!
  variables: [String!]!
  status: String!
  approved: Boolean!
  createdAt: String!
  updatedAt: String!
}

type CRM_WhatsAppConfig {
  businessAccountId: String!
  accessToken: String!
  phoneNumberId: String!
  webhookUrl: String!
  verifyToken: String!
}

type CRM_Campaign {
  _id: ID!
  name: String!
  type: CRM_CampaignType!
  status: CRM_CampaignStatus!
  subject: String
  content: String!
  templateId: ID!
  whatsappConfig: CRM_WhatsAppConfig
  createdAt: String!
  updatedAt: String!
}
```

### **2. Enums Disponibles:**
```graphql
enum CRM_WhatsAppTemplateCategory {
  AUTHENTICATION
  MARKETING
  UTILITY
  CONVERSATIONAL
}

enum CRM_CampaignType {
  EMAIL
  WHATSAPP
  SMS
  PUSH
}
```

---

## 🚀 **MUTATIONS DISPONIBLES**

### **1. Gestión de Plantillas WhatsApp:**
```graphql
# Crear plantilla WhatsApp
createCRMWhatsAppTemplate(
  input: CRM_WhatsAppTemplateInput!
): CRM_WhatsAppTemplateResponse!

# Actualizar plantilla WhatsApp
updateCRMWhatsAppTemplate(
  templateId: String!
  input: CRM_WhatsAppTemplateInput!
): CRM_WhatsAppTemplateResponse!

# Eliminar plantilla WhatsApp
deleteCRMWhatsAppTemplate(templateId: String!): Boolean!
```

### **2. Gestión de Campañas:**
```graphql
# Crear campaña
createCRMCampaign(
  input: CRM_CampaignInput!
): CRM_CampaignResponse!

# Programar campaña
scheduleCRMCampaign(
  campaignId: String!
  scheduledAt: String!
): CRM_CampaignResponse!

# Iniciar campaña
startCRMCampaign(campaignId: String!): CRM_CampaignResponse!

# Pausar campaña
pauseCRMCampaign(campaignId: String!): CRM_CampaignResponse!
```

---

## 🔧 **CONFIGURACIÓN DE WHATSAPP**

### **1. WhatsApp Business API:**
```bash
# Variables de entorno
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/webhook/whatsapp
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

### **2. Twilio WhatsApp:**
```bash
# Variables de entorno
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### **3. Meta WhatsApp:**
```bash
# Variables de entorno
META_WHATSAPP_ACCESS_TOKEN=your_meta_token
META_WHATSAPP_PHONE_NUMBER_ID=your_phone_id
META_WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id
```

---

## 📊 **EJEMPLOS DE USO**

### **1. Crear Plantilla WhatsApp:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createCRMWhatsAppTemplate(input: {name: \"Bienvenida\", category: AUTHENTICATION, content: \"Hola {{name}}, bienvenido a nuestro evento!\", variables: [\"name\"]}) { success template { _id name category content } } }"
  }'
```

### **2. Crear Campaña WhatsApp:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createCRMCampaign(input: {name: \"Campaña WhatsApp\", type: WHATSAPP, content: \"Mensaje de WhatsApp\", templateId: \"template123\"}) { success campaign { _id name type status } } }"
  }'
```

### **3. Iniciar Campaña:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { startCRMCampaign(campaignId: \"campaign123\") { success campaign { _id name status } } }"
  }'
```

---

## 🔍 **QUERIES DISPONIBLES**

### **1. Plantillas WhatsApp:**
```graphql
# Obtener plantillas
getCRMWhatsAppTemplates(
  skip: Int = 0
  limit: Int = 20
  filters: CRM_WhatsAppTemplateFilters
): CRM_WhatsAppTemplateResponse!

# Obtener plantilla por ID
getCRMWhatsAppTemplateById(templateId: String!): CRM_WhatsAppTemplate
```

### **2. Campañas:**
```graphql
# Obtener campañas
getCRMCampaigns(
  skip: Int = 0
  limit: Int = 20
  filters: CRM_CampaignFilters
): CRM_CampaignsResponse!

# Obtener campaña por ID
getCRMCampaignById(campaignId: String!): CRM_Campaign
```

---

## 📱 **FUNCIONALIDADES WHATSAPP**

### **1. Plantillas Predefinidas:**
- **Autenticación**: Códigos de verificación
- **Marketing**: Promociones y ofertas
- **Utilidad**: Confirmaciones y recordatorios
- **Conversacional**: Mensajes personalizados

### **2. Variables Dinámicas:**
- `{{name}}` - Nombre del destinatario
- `{{event}}` - Nombre del evento
- `{{date}}` - Fecha del evento
- `{{location}}` - Ubicación del evento

### **3. Estados de Campaña:**
- **DRAFT** - Borrador
- **SCHEDULED** - Programada
- **RUNNING** - En ejecución
- **PAUSED** - Pausada
- **COMPLETED** - Completada
- **CANCELLED** - Cancelada

---

## 🔧 **INTEGRACIÓN CON N8N**

### **1. Webhook de WhatsApp:**
```bash
# URL del webhook
https://workflow.eventosorganizador.com/webhook/whatsapp

# Configuración en N8N
- Método: POST
- Headers: Content-Type: application/json
- Body: JSON con datos del mensaje
```

### **2. Flujo de Trabajo:**
1. **Recepción** - N8N recibe mensaje WhatsApp
2. **Procesamiento** - Analiza contenido y contexto
3. **Respuesta** - Genera respuesta automática
4. **Envío** - Envía respuesta vía API
5. **Tracking** - Registra en base de datos

---

## 📊 **MÉTRICAS Y TRACKING**

### **1. Métricas de Campaña:**
- **Total enviados** - Número de mensajes enviados
- **Total entregados** - Mensajes entregados exitosamente
- **Total leídos** - Mensajes leídos por destinatarios
- **Total respuestas** - Respuestas recibidas
- **Tasa de entrega** - Porcentaje de entrega exitosa
- **Tasa de lectura** - Porcentaje de mensajes leídos

### **2. Métricas de Plantilla:**
- **Uso de plantilla** - Cuántas veces se usó
- **Tasa de aprobación** - Plantillas aprobadas vs rechazadas
- **Tiempo de aprobación** - Tiempo para aprobar plantilla

---

## ⚠️ **PROBLEMA ACTUAL**

### **❌ Estado: PARCIALMENTE FUNCIONANDO**
- **Causa**: Los tipos de WhatsApp están en CRM pero no hay endpoints específicos
- **Archivo afectado**: `src/graphql/schema-complete.ts`
- **Solución**: Crear tipos GraphQL específicos para WhatsApp

### **🔧 Pasos para Solucionar:**
1. Crear `whatsappTypeDefs.ts`
2. Crear `whatsappResolvers.ts`
3. Agregar al schema principal
4. Recompilar y reiniciar

---

## 🚨 **SOLUCIÓN INMEDIATA**

Para que el sistema de WhatsApp funcione completamente:

1. **Crear tipos específicos:**
```typescript
// src/graphql/typeDefs/whatsapp.ts
export const whatsappTypeDefs = `
  type WhatsAppMessage {
    to: String!
    message: String!
    templateId: String
    variables: [String!]
  }
  
  extend type Mutation {
    sendWhatsAppMessage(input: WhatsAppMessage!): WhatsAppResult!
  }
`;
```

2. **Crear resolvers:**
```typescript
// src/graphql/resolvers/whatsapp.ts
export const whatsappResolvers = {
  Mutation: {
    sendWhatsAppMessage: async (_, { input }) => {
      // Implementar envío de WhatsApp
    }
  }
};
```

---

## 📞 **SOPORTE**

- **Problema**: Servicios implementados, falta exposición GraphQL
- **Solución**: Crear tipos y resolvers específicos
- **Tiempo estimado**: 15 minutos
- **Prioridad**: Media

---

**📅 Última actualización:** 26 de Septiembre 2025  
**✅ Estado:** Servicios implementados, necesita endpoints GraphQL  
**🔧 Acción requerida:** Crear tipos y resolvers específicos












