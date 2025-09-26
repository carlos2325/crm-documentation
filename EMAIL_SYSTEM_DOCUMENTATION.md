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
