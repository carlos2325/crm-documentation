# 📧 SISTEMA DE ENVÍO DE EMAILS - DOCUMENTACIÓN COMPLETA

**Fecha:** 26 de Septiembre 2025  
**Versión:** 2.0  
**Estado:** ✅ Implementado pero no expuesto en GraphQL

---

## 🎯 **RESUMEN EJECUTIVO**

El sistema de envío de emails está completamente implementado con soporte para múltiples proveedores (SendGrid, Amazon SES, Mandrill) y funcionalidades de whitelabel, pero actualmente no está expuesto en el schema GraphQL principal.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **📁 Archivos Implementados:**
- `src/graphql/typeDefs/email.ts` - Tipos GraphQL para email
- `src/graphql/resolvers/email.ts` - Resolvers de email
- `src/graphql/typeDefs/whitelabelEmail.ts` - Tipos para email whitelabel
- `src/graphql/resolvers/whitelabelEmail.ts` - Resolvers para email whitelabel
- `src/services/amazonSESService.ts` - Servicio Amazon SES
- `src/services/mandrillService.ts` - Servicio Mandrill
- `src/services/whitelabelEmailService.ts` - Servicio email whitelabel

### **🔧 Proveedores Soportados:**
1. **SendGrid** - Principal
2. **Amazon SES** - Alternativo
3. **Mandrill** - Alternativo

---

## 📋 **TIPOS GRAPHQL DISPONIBLES**

### **1. Tipos de Email Básico:**
```graphql
type EmailProvider {
  name: String!
  status: String!
}

type EmailSendResult {
  success: Boolean!
  messageId: String
  provider: String!
  error: String
}

type EmailBulkResult {
  recipient: String!
  success: Boolean!
  messageId: String
  error: String
}

type EmailBulkResponse {
  success: Boolean!
  results: [EmailBulkResult!]!
  totalSent: Int!
  totalFailed: Int!
  provider: String!
  error: String
}
```

### **2. Tipos de Email Whitelabel:**
```graphql
type WhitelabelEmailSendResult {
  success: Boolean!
  messageId: String
  provider: String!
  whitelabel: String!
  error: String
}

type WhitelabelEmailConfig {
  whitelabelId: String!
  whitelabelName: String!
  sendgrid: WhitelabelEmailProviderConfig
  ses: WhitelabelEmailProviderConfig
  mandrill: WhitelabelEmailProviderConfig
}
```

---

## 🚀 **MUTATIONS DISPONIBLES**

### **1. Email Básico:**
```graphql
# Enviar email individual
sendEmail(
  to: String!
  subject: String!
  html: String!
  provider: String
): EmailSendResult!

# Enviar email masivo
sendBulkEmail(
  recipients: [String!]!
  subject: String!
  html: String!
  provider: String
): EmailBulkResponse!
```

### **2. Email Whitelabel:**
```graphql
# Enviar email con whitelabel
sendWhitelabelEmail(
  whitelabelId: String!
  provider: String!
  to: String!
  subject: String!
  html: String!
): WhitelabelEmailSendResult!

# Enviar email masivo con whitelabel
sendWhitelabelBulkEmail(
  whitelabelId: String!
  provider: String!
  recipients: [String!]!
  subject: String!
  html: String!
): WhitelabelEmailBulkResponse!
```

---

## 🔧 **CONFIGURACIÓN DE PROVEEDORES**

### **1. SendGrid:**
```bash
# Variables de entorno
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### **2. Amazon SES:**
```bash
# Variables de entorno
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@yourdomain.com
```

### **3. Mandrill:**
```bash
# Variables de entorno
MANDRILL_API_KEY=your_mandrill_api_key
MANDRILL_FROM_EMAIL=noreply@yourdomain.com
MANDRILL_FROM_NAME=Your Company
```

---

## 📊 **SISTEMA DE MÉTRICAS Y TRACKING**

### **1. 📈 Métricas de Envío:**
```graphql
type USAGE_DeliveryMetrics {
  total_sent: Int!           # Total de emails enviados
  total_delivered: Int!      # Total de emails entregados
  total_bounced: Int!        # Total de emails rebotados
  total_failed: Int!         # Total de emails fallidos
  delivery_rate: Float!      # Tasa de entrega (%)
  billed_amount: Float!      # Monto facturado (solo entregados)
}

type USAGE_CampaignBilling {
  campaign_id: ID!
  campaign_name: String!
  campaign_type: String!
  client_number: String!
  total_sent: Int!
  total_delivered: Int!
  delivery_rate: Float!
  unit_cost: Float!
  total_cost: Float!
  billing_period: String!
  processed_at: String!
}
```

### **2. 📊 Estadísticas de Apertura y Clicks:**
```graphql
type CampaignStats {
  totalSent: Int!            # Total enviados
  delivered: Int!            # Entregados
  bounced: Int!              # Rebotados
  opened: Int!               # Abiertos
  clicked: Int!              # Clickeados
  unsubscribed: Int!         # Desuscritos
  complained: Int!           # Quejas
  
  # Tasas calculadas
  deliveryRate: Float!       # Tasa de entrega
  openRate: Float!           # Tasa de apertura
  clickRate: Float!          # Tasa de clicks
  unsubscribeRate: Float!    # Tasa de desuscripción
}
```

### **3. 💰 Contabilización Automática:**
```graphql
type USAGE_UsageTracking {
  _id: ID!
  session_id: String!
  client_number: String!
  message_id: String!
  source: String!
  
  # Tracking de delivery
  delivery_tracking: {
    total_sent: Int!
    total_delivered: Int!
    total_bounced: Int!
    total_failed: Int!
    delivery_rate: Float!
    billed_amount: Float!    # Solo se cobra por entregados
  }
  
  # Items de facturación
  billing_items: [USAGE_BillingItem!]!
  total_cost_usd: Float!
  billing_period: String!
  billed: Boolean!
}
```

## 📊 **EJEMPLOS DE USO**

### **1. Enviar Email Individual:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendEmail(to: \"test@example.com\", subject: \"Test Email\", html: \"<h1>Hello World!</h1>\", provider: \"sendgrid\") { success messageId provider error } }"
  }'
```

### **2. Enviar Email Masivo:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendBulkEmail(recipients: [\"user1@example.com\", \"user2@example.com\"], subject: \"Bulk Email\", html: \"<h1>Bulk Message</h1>\", provider: \"sendgrid\") { success totalSent totalFailed results { recipient success messageId error } } }"
  }'
```

### **3. Enviar Email con Whitelabel:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { sendWhitelabelEmail(whitelabelId: \"whitelabel123\", provider: \"sendgrid\", to: \"test@example.com\", subject: \"Whitelabel Email\", html: \"<h1>Whitelabel Message</h1>\") { success messageId provider whitelabel error } }"
  }'
```

### **4. Obtener Métricas de Campaña:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getCampaignDeliveryMetrics(campaign_id: \"campaign123\") { total_sent total_delivered total_bounced delivery_rate billed_amount } }"
  }'
```

### **5. Obtener Reporte de Facturación:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getDeliveryBillingReport(billing_period: \"2025-09\") { billing_period total_campaigns total_sent total_delivered total_billed avg_delivery_rate campaigns { campaign_id campaign_name total_sent total_delivered delivery_rate total_cost } } }"
  }'
```

---

## 🔍 **QUERIES DISPONIBLES**

### **1. Probar Servicio de Email:**
```graphql
# Probar servicio básico
testEmailService(provider: String!): EmailTestResult!

# Obtener proveedores disponibles
getEmailProviders: [EmailProvider!]!
```

### **2. Probar Servicio Whitelabel:**
```graphql
# Probar servicio whitelabel
testWhitelabelEmailService(whitelabelId: String!, provider: String!): WhitelabelEmailTestResult!

# Obtener configuración whitelabel
getWhitelabelEmailConfig(whitelabelId: String!): WhitelabelEmailConfig
```

### **3. 📊 Métricas y Estadísticas:**
```graphql
# Obtener métricas de delivery de campaña
getCampaignDeliveryMetrics(campaign_id: ID!): USAGE_DeliveryMetrics

# Obtener reporte de facturación por delivery
getDeliveryBillingReport(billing_period: String!): USAGE_DeliveryBillingReport!

# Obtener campañas para facturación
getCampaignsForBilling(filters: USAGE_CampaignFilters!): [USAGE_CampaignBilling!]!

# Obtener estadísticas del dashboard
getUsageTrackingStats: USAGE_DashboardStats

# Obtener facturación por cliente
getClientMonthlyCost(client_number: String!, billing_period: String!): USAGE_ClientBillingSummary
```

### **4. 📈 Tracking de Uso:**
```graphql
# Obtener historial de uso
getUsageHistory(client_number: String, limit: Int, offset: Int): [USAGE_UsageTracking!]!

# Obtener registro específico
getUsageTracking(id: ID!): USAGE_UsageTracking

# Obtener top clientes
getTopClients(start_date: String!, end_date: String!, limit: Int): [USAGE_ClientRanking!]!
```

---

## 📊 **FUNCIONALIDADES DE MÉTRICAS IMPLEMENTADAS**

### **1. 🎯 Tracking de Apertura:**
- **Configuración**: `trackOpens: true` en CampaignSettings
- **Implementación**: Pixel de tracking en emails
- **Métricas**: `opened`, `openRate`
- **Tiempo real**: Actualización automática

### **2. 🖱️ Tracking de Clicks:**
- **Configuración**: `trackClicks: true` en CampaignSettings
- **Implementación**: Links con parámetros de tracking
- **Métricas**: `clicked`, `clickRate`
- **Análisis**: Qué links son más efectivos

### **3. 📧 Tracking de Rebotes:**
- **Tipos**: Hard bounce, soft bounce
- **Métricas**: `bounced`, `deliveryRate`
- **Acción**: Lista de supresión automática
- **Análisis**: Calidad de base de datos

### **4. 🚫 Tracking de Desuscripciones:**
- **Configuración**: `unsubscribeLink: true`
- **Métricas**: `unsubscribed`, `unsubscribeRate`
- **Cumplimiento**: Leyes de protección de datos
- **Lista**: Gestión automática de desuscripciones

### **5. ⚠️ Tracking de Quejas:**
- **Métricas**: `complained`
- **Acción**: Suspensión automática de envíos
- **Análisis**: Calidad del contenido
- **Cumplimiento**: Mantener reputación del dominio

### **6. 💰 Contabilización Inteligente:**
- **Solo entregados**: Se cobra únicamente por emails entregados
- **Tasas de entrega**: Cálculo automático de `delivery_rate`
- **Facturación por período**: Agrupación mensual automática
- **Reportes detallados**: Desglose por cliente y campaña

### **7. 📈 Dashboard en Tiempo Real:**
```graphql
type USAGE_DashboardStats {
  total_clients: Int!           # Total de clientes activos
  total_cost_today: Float!      # Costo total del día
  total_interactions_today: Int! # Interacciones del día
  top_clients: [USAGE_ClientRanking!]! # Top clientes por uso
  cost_by_category: [USAGE_CategoryBreakdown!]! # Costo por categoría
}
```

### **8. 🔄 Procesamiento Automático:**
- **Batch processing**: Cada 4 horas
- **Actualización de métricas**: Tiempo real
- **Facturación automática**: Por período
- **Alertas**: Límites de costo y uso

---

## ⚠️ **PROBLEMA ACTUAL**

### **❌ Estado: NO FUNCIONANDO**
- **Causa**: Los tipos de email no están incluidos en el schema principal
- **Archivo afectado**: `src/graphql/schema-complete.ts`
- **Solución**: Agregar `emailTypeDefs` y `whitelabelEmailTypeDefs` al schema

### **🔧 Pasos para Solucionar:**
1. Agregar imports en `schema-complete.ts`
2. Incluir en `allTypeDefs`
3. Incluir en `allResolvers`
4. Recompilar con `npm run build:production`
5. Reiniciar servidor

---

## 📈 **FUNCIONALIDADES AVANZADAS**

### **1. Sistema de Fallback:**
- Si SendGrid falla, automáticamente intenta con Amazon SES
- Si Amazon SES falla, intenta con Mandrill
- Logging completo de errores

### **2. Whitelabel Multi-Tenant:**
- Configuración independiente por whitelabel
- Proveedores específicos por cliente
- Métricas separadas por whitelabel

### **3. Tracking y Métricas:**
- MessageId único por email
- Tracking de éxito/fallo
- Métricas de proveedor utilizado
- Logs detallados

---

## 🚨 **SOLUCIÓN INMEDIATA**

Para que el sistema de email funcione, necesitas:

1. **Agregar al schema principal:**
```typescript
// En src/graphql/schema-complete.ts
import { emailTypeDefs } from './typeDefs/email';
import { whitelabelEmailTypeDefs } from './typeDefs/whitelabelEmail';
import { emailResolvers } from './resolvers/email';
import { whitelabelEmailResolvers } from './resolvers/whitelabelEmail';

// En allTypeDefs
emailTypeDefs,
whitelabelEmailTypeDefs,

// En allResolvers
emailResolvers,
whitelabelEmailResolvers,
```

2. **Recompilar y reiniciar:**
```bash
npm run build:production
pm2 restart api-prod
```

---

## 📞 **SOPORTE**

- **Problema**: Sistema implementado pero no expuesto
- **Solución**: Agregar al schema principal
- **Tiempo estimado**: 5 minutos
- **Prioridad**: Alta

---

**📅 Última actualización:** 26 de Septiembre 2025  
**✅ Estado:** Implementado, necesita configuración  
**🔧 Acción requerida:** Agregar al schema principal
